import { Injectable, Logger, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PaymongoService, CreatePaymentLinkRequest } from '../paymongo/paymongo.service';
import { RealtimeService } from '../realtime/realtime.service';
import { qrCodes, QrCode, NewQrCode } from '../database/schema/qr_codes.schema';
import { events } from '../database/schema/events.schema';
import { eq, and, desc } from 'drizzle-orm';
import * as cron from 'node-cron';

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
  async generateQRCode(eventId: string, userId: string): Promise<QrCode> {
    const db = this.databaseService.getDatabase();

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

      // Create Paymongo payment link
      const paymentLinkRequest: CreatePaymentLinkRequest = {
        amount: Math.round(parseFloat(event.price) * 100), // Convert to cents
        currency: event.currency,
        description: `Payment for ${event.name}`,
        reference_number: `EVENT_${eventId}_${Date.now()}`,
        remarks: `QR code payment for event: ${event.name}`,
      };

      const paymentLink = await this.paymongoService.createPaymentLink(paymentLinkRequest);
      
      // Generate expiry time (30 minutes from now)
      const expiresAt = this.paymongoService.generateExpiryTime(30);
      
      // Create QR code record in database
      const newQrCode: NewQrCode = {
        eventId: eventId,
        qrData: paymentLink.attributes.checkout_url,
        paymongoLinkId: paymentLink.id,
        paymongoLinkUrl: paymentLink.attributes.checkout_url,
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
        checkoutUrl: paymentLink.attributes.checkout_url,
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
  async getCurrentQRCode(eventId: string, userId: string): Promise<QrCode | null> {
    const db = this.databaseService.getDatabase();

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
        .where(
          and(
            eq(qrCodes.eventId, eventId),
            eq(qrCodes.status, 'active'),
            eq(qrCodes.isActive, true)
          )
        )
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

  /**
   * Get QR code by ID with status check
   */
  async getQRCodeStatus(qrCodeId: string): Promise<{
    qrCode: QrCode;
    isValid: boolean;
    timeUntilExpiry?: number;
  }> {
    const db = this.databaseService.getDatabase();

    const [qrCode] = await db
      .select()
      .from(qrCodes)
      .where(eq(qrCodes.id, qrCodeId))
      .limit(1);

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
  async getQRCodeHistory(eventId: string, userId: string): Promise<QrCode[]> {
    const db = this.databaseService.getDatabase();

    // Verify event ownership
    const [event] = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.createdBy, userId)))
      .limit(1);

    if (!event) {
      throw new NotFoundException('Event not found or not owned by user');
    }

    return await db
      .select()
      .from(qrCodes)
      .where(eq(qrCodes.eventId, eventId))
      .orderBy(desc(qrCodes.createdAt));
  }

  /**
   * Manually regenerate QR code for an event
   */
  async regenerateQRCode(eventId: string, userId: string): Promise<QrCode> {
    this.logger.log(`Manually regenerating QR code for event ${eventId}`);
    return await this.generateQRCode(eventId, userId);
  }

  /**
   * Mark QR code as used
   */
  async markQRCodeUsed(qrCodeId: string, eventId: string): Promise<void> {
    const db = this.databaseService.getDatabase();
    
    await db
      .update(qrCodes)
      .set({
        status: 'used',
        usedAt: new Date(),
        usageCount: db.select().from(qrCodes).where(eq(qrCodes.id, qrCodeId)),
      })
      .where(eq(qrCodes.id, qrCodeId));

    this.logger.log(`QR code ${qrCodeId} marked as used`);

    // Broadcast QR code status update
    this.realtimeService.notifyQRStatusUpdate(eventId, {
      qrCodeId,
      eventId,
      status: 'used',
    });
  }

  /**
   * Mark QR code as expired
   */
  private async markQRCodeExpired(qrCodeId: string, eventId: string): Promise<void> {
    const db = this.databaseService.getDatabase();
    
    await db
      .update(qrCodes)
      .set({
        status: 'expired',
        isActive: false,
      })
      .where(eq(qrCodes.id, qrCodeId));

    this.logger.log(`QR code ${qrCodeId} marked as expired`);

    // Broadcast QR code status update
    this.realtimeService.notifyQRStatusUpdate(eventId, {
      qrCodeId,
      eventId,
      status: 'expired',
    });
  }

  /**
   * Invalidate all active QR codes for an event
   */
  private async invalidateActiveQRCodes(eventId: string): Promise<void> {
    const db = this.databaseService.getDatabase();
    
    // Get all active QR codes for this event
    const activeQrCodes = await db
      .select()
      .from(qrCodes)
      .where(
        and(
          eq(qrCodes.eventId, eventId),
          eq(qrCodes.status, 'active')
        )
      );

    // Archive them in Paymongo and mark as invalidated in our DB
    for (const qrCode of activeQrCodes) {
      try {
        await this.paymongoService.archivePaymentLink(qrCode.paymongoLinkId);
      } catch (error) {
        this.logger.warn(`Failed to archive payment link ${qrCode.paymongoLinkId}:`, error);
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
      .where(
        and(
          eq(qrCodes.eventId, eventId),
          eq(qrCodes.status, 'active')
        )
      );

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
    const db = this.databaseService.getDatabase();
    const now = new Date();

    const expiredQrCodes = await db
      .select()
      .from(qrCodes)
      .where(
        and(
          eq(qrCodes.status, 'active'),
          eq(qrCodes.isActive, true)
        )
      );

    const toExpire = expiredQrCodes.filter(qr => new Date(qr.expiresAt) < now);

    if (toExpire.length > 0) {
      for (const qrCode of toExpire) {
        await this.markQRCodeExpired(qrCode.id, qrCode.eventId);
      }
      this.logger.log(`Cleaned up ${toExpire.length} expired QR codes`);
    }

    // Check for QR codes expiring soon (5 minutes warning)
    const soonToExpire = expiredQrCodes.filter(qr => {
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