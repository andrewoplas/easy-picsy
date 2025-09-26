import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { QrCodeStatus } from '@org/commons';
import { and, desc, eq } from 'drizzle-orm';
import * as cron from 'node-cron';
import * as QRCode from 'qrcode';
import { DatabaseService } from '../database/database.service';
import { events } from '../database/schema/events.schema';
import { NewQrCode, qrCodes } from '../database/schema/qr_codes.schema';
import { CreatePaymentIntentRequest, PaymongoService } from '../paymongo/paymongo.service';
import { RealtimeService } from '../realtime/realtime.service';
import { QrCodeResponseDto } from './dto/qr-code-response.dto';
import { QrCodeStatusResponseDto } from './dto/qr-code-status-response.dto';

@Injectable()
export class QrCodesService {
  private readonly logger = new Logger(QrCodesService.name);

  constructor(
    private databaseService: DatabaseService,
    private paymongoService: PaymongoService,
    @Inject(forwardRef(() => RealtimeService))
    private realtimeService: RealtimeService,
  ) {
    // Start cleanup job for expired QR codes (runs every 5 minutes)
    this.startCleanupJob();
  }

  /**
   * Generate a new QR code for an event
   */
  async generateQRCode(eventId: string, userId: string): Promise<QrCodeResponseDto> {
    const db = this.databaseService.getDb();

    try {
      // First, get the event details
      const [event] = await db
        .select()
        .from(events)
        .where(and(eq(events.id, eventId), eq(events.createdBy, userId)))
        .limit(1);

      if (!event) {
        throw new NotFoundException('Event not found or not owned by user');
      }

      // Invalidate any existing active QR codes for this event
      await this.invalidateActiveQRCodes(eventId);

      // Validate minimum amount for QR Ph (PHP 20.00 = 2000 centavos)
      const amountInCentavos = Math.round(parseFloat(event.price) * 100);
      const minimumAmount = 2000; // PHP 20.00

      if (amountInCentavos < minimumAmount) {
        throw new Error(
          `Amount must be at least PHP 20.00 for QR Ph payments. Current amount: PHP ${parseFloat(event.price).toFixed(
            2,
          )}`,
        );
      }

      // Create Paymongo payment intent with QR Ph only (no payment links)
      const paymentIntentRequest: CreatePaymentIntentRequest = {
        amount: amountInCentavos,
        currency: event.currency,
        description: `Payment for ${event.name}`,
        reference_number: `EVENT_${eventId}_${Date.now()}`,
        payment_method_allowed: ['qrph'],
      };

      const paymentIntent = await this.paymongoService.createPaymentIntentWithQR(paymentIntentRequest);

      // Create and attach QR Ph payment method to get the actual QR code image
      const qrResult = await this.paymongoService.createAndAttachQRPaymentMethod(paymentIntent.id);
      let qrCodeImage = qrResult?.qrImage;
      let qrphId = qrResult?.qrphId;

      // If PayMongo doesn't provide QR image, generate one with payment info (fallback)
      if (!qrCodeImage) {
        this.logger.warn('PayMongo did not provide QR image, using fallback generation');
        const qrPayload = {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.attributes.amount,
          currency: paymentIntent.attributes.currency,
          description: paymentIntent.attributes.description,
          eventId: eventId,
        };

        qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrPayload), {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });

        // For fallback QR codes, use payment intent ID as qrph ID
        qrphId = qrphId || paymentIntent.id;
      }

      // Generate expiry time (30 minutes from now as per PayMongo QR Ph spec)
      const expiresAt = this.paymongoService.generateExpiryTime(30);

      // Create QR code record in database
      const newQrCode: NewQrCode = {
        eventId: eventId,
        qrData: qrCodeImage || '', // Store the base64 QR code image
        paymentIntentId: paymentIntent.id, // Store payment intent ID for webhook matching
        paymongoLinkUrl: null, // No longer creating payment links
        paymongoQrphId: qrphId, // Store QR Ph resource ID for expiry tracking
        status: 'active',
        expiresAt: expiresAt,
        usageCount: 0,
        maxUsage: 1,
        isActive: true,
      };

      const [createdQrCode] = await db.insert(qrCodes).values(newQrCode).returning();

      this.logger.log(`QR code generated for event ${eventId}: ${createdQrCode.id}`);

      // Broadcast QR code generation to connected clients
      this.realtimeService.notifyQRCodeGenerated(eventId, {
        qrCodeId: createdQrCode.id,
        eventId: eventId,
        checkoutUrl: null, // No longer using payment links - QR Ph scanning only
        qrCodeImage: qrCodeImage, // Include the base64 QR code image
        expiresAt: expiresAt.toISOString(),
        amount: parseFloat(event.price),
        currency: event.currency,
      });

      return createdQrCode;
    } catch (error) {
      this.logger.error(`Failed to generate QR code for event ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Get the current active QR code for an event
   */
  async getCurrentQRCode(eventId: string, userId: string): Promise<QrCodeResponseDto | null> {
    const db = this.databaseService.getDb();

    try {
      // Verify event ownership
      const [event] = await db
        .select()
        .from(events)
        .where(and(eq(events.id, eventId), eq(events.createdBy, userId)))
        .limit(1);

      if (!event) {
        throw new NotFoundException('Event not found or not owned by user');
      }

      // Get the most recent active QR code
      const [qrCode] = await db
        .select()
        .from(qrCodes)
        .where(and(eq(qrCodes.eventId, eventId), eq(qrCodes.status, 'active'), eq(qrCodes.isActive, true)))
        .orderBy(desc(qrCodes.createdAt))
        .limit(1);

      // Check if QR code is expired
      if (qrCode && new Date() > new Date(qrCode.expiresAt)) {
        await this.markQRCodeExpired(qrCode.id, eventId);
        return null;
      }

      return qrCode || null;
    } catch (error) {
      this.logger.error(`Failed to get current QR code for event ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Get QR code by ID with status check
   */
  async getQRCodeStatus(qrCodeId: string): Promise<QrCodeStatusResponseDto> {
    const db = this.databaseService.getDb();

    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.id, qrCodeId)).limit(1);

    if (!qrCode) {
      throw new NotFoundException('QR code not found');
    }

    const now = new Date();
    const expiryTime = new Date(qrCode.expiresAt);
    const isExpired = now > expiryTime;
    const isValid = qrCode.isActive && qrCode.status === 'active' && !isExpired;

    // If expired but not marked as such, mark it expired
    if (isExpired && qrCode.status === 'active') {
      await this.markQRCodeExpired(qrCode.id, qrCode.eventId);
      qrCode.status = 'expired';
    }

    const timeUntilExpiry = isValid ? expiryTime.getTime() - now.getTime() : 0;

    return {
      qrCode,
      isValid,
      timeUntilExpiry: timeUntilExpiry > 0 ? timeUntilExpiry : undefined,
    };
  }

  /**
   * Get QR code history for an event
   */
  async getQRCodeHistory(eventId: string, userId: string): Promise<QrCodeResponseDto[]> {
    const db = this.databaseService.getDb();

    // Verify event ownership
    const [event] = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.createdBy, userId)))
      .limit(1);

    if (!event) {
      throw new NotFoundException('Event not found or not owned by user');
    }

    return await db.select().from(qrCodes).where(eq(qrCodes.eventId, eventId)).orderBy(desc(qrCodes.createdAt));
  }

  /**
   * Manually regenerate QR code for an event
   */
  async regenerateQRCode(eventId: string, userId: string): Promise<QrCodeResponseDto> {
    this.logger.log(`Manually regenerating QR code for event ${eventId}`);
    return await this.generateQRCode(eventId, userId);
  }

  /**
   * Mark QR code as used (deprecated - use markQRCodePaid instead)
   */
  async markQRCodeUsed(qrCodeId: string, eventId: string): Promise<void> {
    const db = this.databaseService.getDb();

    await db
      .update(qrCodes)
      .set({
        status: 'used',
        usedAt: new Date(),
        usageCount: 1,
      })
      .where(eq(qrCodes.id, qrCodeId));

    this.logger.log(`QR code ${qrCodeId} marked as used`);

    // Broadcast QR code status update
    this.realtimeService.notifyQRStatusUpdate(eventId, {
      qrCodeId,
      eventId,
      status: QrCodeStatus.USED,
    });
  }

  /**
   * Mark QR code as paid (successful payment)
   */
  async markQRCodePaid(qrCodeId: string, eventId: string, paymentId?: string): Promise<void> {
    const db = this.databaseService.getDb();

    await db
      .update(qrCodes)
      .set({
        status: QrCodeStatus.PAID,
        usedAt: new Date(),
        usageCount: 1,
        isActive: false,
        paymentId: paymentId || null,
      })
      .where(eq(qrCodes.id, qrCodeId));

    this.logger.log(`QR code ${qrCodeId} marked as paid${paymentId ? ` with payment ID: ${paymentId}` : ''}`);

    // Broadcast payment success notification instead of QR status update
    this.realtimeService.notifyPaymentSuccess(eventId, {
      qrCodeId,
      eventId,
      paymentId: paymentId || qrCodeId, // Use actual payment ID if available
      amount: 0, // Amount should be retrieved from payment data
      currency: 'PHP',
    });
  }

  /**
   * Mark QR code as failed (failed payment)
   */
  async markQRCodeFailed(qrCodeId: string, eventId: string, failureReason?: string): Promise<void> {
    const db = this.databaseService.getDb();

    await db
      .update(qrCodes)
      .set({
        status: 'failed' as QrCodeStatus,
        usageCount: 1,
        isActive: false,
      })
      .where(eq(qrCodes.id, qrCodeId));

    this.logger.log(`QR code ${qrCodeId} marked as failed`, { failureReason });

    // Broadcast payment failure notification instead of QR status update
    this.realtimeService.notifyPaymentFailed(eventId, {
      qrCodeId,
      eventId,
      paymentId: qrCodeId, // Using QR code ID as payment ID for now
      failureReason: failureReason || 'Unknown error',
    });
  }

  /**
   * Mark QR code as expired
   */
  async markQRCodeExpired(qrCodeId: string, eventId: string): Promise<void> {
    const db = this.databaseService.getDb();

    await db
      .update(qrCodes)
      .set({
        status: QrCodeStatus.EXPIRED,
        isActive: false,
      })
      .where(eq(qrCodes.id, qrCodeId));

    this.logger.log(`QR code ${qrCodeId} marked as expired`);

    // Broadcast QR code status update
    this.realtimeService.notifyQRStatusUpdate(eventId, {
      qrCodeId,
      eventId,
      status: QrCodeStatus.EXPIRED,
    });
  }

  /**
   * Invalidate all active QR codes for an event
   */
  private async invalidateActiveQRCodes(eventId: string): Promise<void> {
    const db = this.databaseService.getDb();

    // Get all active QR codes for this event
    const activeQrCodes = await db
      .select()
      .from(qrCodes)
      .where(and(eq(qrCodes.eventId, eventId), eq(qrCodes.status, 'active')));

    // Cancel them in PayMongo and mark as invalidated in our DB
    for (const qrCode of activeQrCodes) {
      try {
        // Check if it's a payment intent (pi_xxx) or payment link (link_xxx)
        if (qrCode.paymentIntentId.startsWith('pi_')) {
          await this.paymongoService.cancelPaymentIntent(qrCode.paymentIntentId);
        } else {
          this.logger.warn(`Unknown PayMongo resource type: ${qrCode.paymentIntentId}`);
        }
      } catch (error) {
        // Don't block QR generation if cleanup fails
        this.logger.warn(`Failed to invalidate PayMongo resource ${qrCode.paymentIntentId}:`, (error as Error).message);
      }
    }

    // Mark them as invalidated in our database
    await db
      .update(qrCodes)
      .set({
        status: 'invalidated',
        isActive: false,
        invalidatedAt: new Date(),
      })
      .where(and(eq(qrCodes.eventId, eventId), eq(qrCodes.status, 'active')));

    this.logger.log(`Invalidated ${activeQrCodes.length} active QR codes for event ${eventId}`);
  }

  /**
   * Cleanup job that runs every 5 minutes to mark expired QR codes
   */
  private startCleanupJob(): void {
    cron.schedule('*/5 * * * *', async () => {
      try {
        await this.cleanupExpiredQRCodes();
      } catch (error) {
        this.logger.error('Error during QR code cleanup:', error);
      }
    });

    this.logger.log('QR code cleanup job started (runs every 5 minutes)');
  }

  /**
   * Find and mark expired QR codes
   */
  private async cleanupExpiredQRCodes(): Promise<void> {
    const db = this.databaseService.getDb();
    const now = new Date();

    const expiredQrCodes = await db
      .select()
      .from(qrCodes)
      .where(and(eq(qrCodes.status, 'active'), eq(qrCodes.isActive, true)));

    const toExpire = expiredQrCodes.filter((qr) => new Date(qr.expiresAt) < now);

    if (toExpire.length > 0) {
      for (const qrCode of toExpire) {
        await this.markQRCodeExpired(qrCode.id, qrCode.eventId);
      }
      this.logger.log(`Cleaned up ${toExpire.length} expired QR codes`);
    }

    // Check for QR codes expiring soon (5 minutes warning)
    const soonToExpire = expiredQrCodes.filter((qr) => {
      const timeUntilExpiry = new Date(qr.expiresAt).getTime() - now.getTime();
      return timeUntilExpiry > 0 && timeUntilExpiry <= 5 * 60 * 1000; // 5 minutes in milliseconds
    });

    for (const qrCode of soonToExpire) {
      const timeUntilExpiry = new Date(qrCode.expiresAt).getTime() - now.getTime();
      const minutesRemaining = Math.ceil(timeUntilExpiry / (60 * 1000));
      this.realtimeService.notifyQRExpiryWarning(qrCode.eventId, qrCode.id, minutesRemaining);
    }
  }
}
