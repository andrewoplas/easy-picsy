import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaymentMethod, QrCodeStatus } from '@org/commons';
import { and, desc, eq } from 'drizzle-orm';
import * as cron from 'node-cron';
import { DatabaseService } from '../database/database.service';
import { events } from '../database/schema/events.schema';
import { NewQrCode, qrCodes, QrCode } from '../database/schema/qr_codes.schema';
import { CreatePaymentIntentRequest, PaymongoService } from '../paymongo/paymongo.service';
import { QrCodeResponseDto } from './dto/qr-code-response.dto';
import { QrCodeStatusResponseDto } from './dto/qr-code-status-response.dto';

@Injectable()
export class QrCodesService {
  private readonly logger = new Logger(QrCodesService.name);

  constructor(private databaseService: DatabaseService, private paymongoService: PaymongoService) {
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
        payment_method_allowed: [PaymentMethod.QRPH],
      };

      const paymentIntent = await this.paymongoService.createPaymentIntentWithQR(paymentIntentRequest);

      // Create and attach QR Ph payment method to get the actual QR code image
      const qrResult = await this.paymongoService.createAndAttachQRPaymentMethod(paymentIntent.id);
      const qrCodeImage = qrResult?.qrImage;
      const qrphId = qrResult?.qrphId;

      // If PayMongo doesn't provide QR image, throw error - we cannot generate a fallback
      if (!qrCodeImage) {
        this.logger.error('PayMongo failed to provide QR image - cannot proceed with payment');
        throw new Error(
          "Payment provider failed to generate QR code image. This could indicate an issue with the payment provider's QR Ph service. Please try again in a few minutes or contact support if the issue persists.",
        );
      }

      // If we don't have a qrphId, something went wrong with the PayMongo integration
      if (!qrphId) {
        this.logger.error('PayMongo failed to provide QR Ph ID - cannot proceed with payment');
        throw new Error(
          "Payment provider failed to generate QR Ph identifier. This could indicate an issue with the payment provider's QR Ph service. Please try again in a few minutes or contact support if the issue persists.",
        );
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
        status: QrCodeStatus.ACTIVE,
        expiresAt: expiresAt,
        usageCount: 0,
        maxUsage: 1,
        isActive: true,
      };

      const [createdQrCode] = await db.insert(qrCodes).values(newQrCode).returning();

      this.logger.log(`QR code generated for event ${eventId}: ${createdQrCode.id}`);

      // QR code generation is instant - no need for real-time notification
      // QR data is returned directly in the API response

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
        .where(and(eq(qrCodes.eventId, eventId), eq(qrCodes.status, QrCodeStatus.ACTIVE), eq(qrCodes.isActive, true)))
        .orderBy(desc(qrCodes.createdAt))
        .limit(1);

      // Check if QR code is expired
      if (qrCode && new Date() > new Date(qrCode.expiresAt)) {
        await this.markQRCodeExpired(qrCode.id);
        return null;
      }

      return qrCode || null;
    } catch (error) {
      this.logger.error(`Failed to get current QR code for event ${eventId}:`, error);
      throw error;
    }
  }

  async getQRCodeById(qrCodeId: string): Promise<QrCode> {
    const db = this.databaseService.getDb();

    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.id, qrCodeId)).limit(1);

    if (!qrCode) {
      throw new NotFoundException('QR code not found');
    }

    return qrCode;
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
    const isValid = qrCode.isActive && qrCode.status === QrCodeStatus.ACTIVE && !isExpired;

    // If expired but not marked as such, mark it expired
    if (isExpired && qrCode.status === QrCodeStatus.ACTIVE) {
      await this.markQRCodeExpired(qrCode.id);
      qrCode.status = QrCodeStatus.EXPIRED;
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
   * @deprecated Use markQRCodePaid instead
   */
  async markQRCodeUsed(qrCodeId: string, eventId: string): Promise<void> {
    // Forward to markQRCodePaid for backward compatibility
    await this.markQRCodePaid(qrCodeId, eventId);
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
  }

  /**
   * Mark QR code as completed (booth session finished)
   */
  async markQRCodeCompleted(qrCodeId: string): Promise<void> {
    const db = this.databaseService.getDb();

    // Get current QR code
    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.id, qrCodeId)).limit(1);

    if (!qrCode) {
      throw new NotFoundException(`QR code ${qrCodeId} not found`);
    }

    // Only PAID QR codes can be completed
    if (qrCode.status !== QrCodeStatus.PAID) {
      throw new Error(`Cannot complete QR code ${qrCodeId} with status ${qrCode.status}`);
    }

    await db
      .update(qrCodes)
      .set({
        status: QrCodeStatus.SESSION_COMPLETED,
        isActive: false,
      })
      .where(eq(qrCodes.id, qrCodeId));

    this.logger.log(`QR code ${qrCodeId} marked as completed`);
  }

  /**
   * Mark QR code as failed (failed payment)
   */
  async markQRCodeFailed(qrCodeId: string, eventId: string, failureReason?: string): Promise<void> {
    const db = this.databaseService.getDb();

    await db
      .update(qrCodes)
      .set({
        status: QrCodeStatus.FAILED,
        usageCount: 1,
        isActive: false,
      })
      .where(eq(qrCodes.id, qrCodeId));

    this.logger.log(`QR code ${qrCodeId} marked as failed`, { failureReason });
  }

  async markQRCodeExpired(qrCodeId: string): Promise<void> {
    const db = this.databaseService.getDb();

    await db
      .update(qrCodes)
      .set({
        status: QrCodeStatus.EXPIRED,
        isActive: false,
      })
      .where(eq(qrCodes.id, qrCodeId));

    this.logger.log(`QR code ${qrCodeId} marked as expired`);

    // QR expiry is handled by expiry warning - no separate notification needed
  }

  private async invalidateActiveQRCodes(eventId: string): Promise<void> {
    const db = this.databaseService.getDb();

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

    await db
      .update(qrCodes)
      .set({
        status: QrCodeStatus.INVALIDATED,
        isActive: false,
        invalidatedAt: new Date(),
      })
      .where(and(eq(qrCodes.eventId, eventId), eq(qrCodes.status, QrCodeStatus.ACTIVE)));

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
      .where(and(eq(qrCodes.status, QrCodeStatus.ACTIVE), eq(qrCodes.isActive, true)));

    const toExpire = expiredQrCodes.filter((qr) => new Date(qr.expiresAt) < now);

    if (toExpire.length > 0) {
      for (const qrCode of toExpire) {
        await this.markQRCodeExpired(qrCode.id);
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
      this.logger.log(`QR code ${qrCode.id} expires in ${minutesRemaining} minutes`);
    }
  }
}
