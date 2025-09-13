import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymongoService } from '../paymongo/paymongo.service';
import { DatabaseService } from '../database/database.service';
import { QrCodesService } from '../qr-codes/qr-codes.service';
import { LoggingService } from '../logging/logging.service';
import { qrCodes } from '../database/schema';
import { eq, and, inArray, lt } from 'drizzle-orm';

/**
 * Service to reconcile missed webhook events
 * Best Practice #4: Fallback mechanism for webhook failures
 */
@Injectable()
export class WebhookReconciliationService {
  private readonly logger = new Logger(WebhookReconciliationService.name);

  constructor(
    private paymongoService: PaymongoService,
    private databaseService: DatabaseService,
    private qrCodesService: QrCodesService,
    private loggingService: LoggingService,
  ) {}

  /**
   * Run reconciliation every 5 minutes to check for missed events
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async reconcileMissedPayments() {
    try {
      this.logger.log('Starting webhook reconciliation check');
      
      const db = this.databaseService.getDb();
      
      // Find active QR codes that are older than 2 minutes
      // These might have completed payments we missed
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      
      const activeQrCodes = await db
        .select()
        .from(qrCodes)
        .where(
          and(
            eq(qrCodes.status, 'active'),
            eq(qrCodes.isActive, true),
            lt(qrCodes.createdAt, twoMinutesAgo)
          )
        )
        .limit(10); // Process in batches
      
      if (activeQrCodes.length === 0) {
        return;
      }
      
      this.logger.log(`Checking ${activeQrCodes.length} active QR codes for missed payments`);
      
      for (const qrCode of activeQrCodes) {
        try {
          // Check payment intent status with PayMongo API
          const paymentIntent = await this.paymongoService.getPaymentIntent(qrCode.paymongoLinkId);
          
          // If payment is completed but QR code is still active, we missed the webhook
          if (paymentIntent.attributes.status === 'succeeded' && qrCode.status === 'active') {
            this.logger.warn(`Found missed payment for QR code ${qrCode.id}`);
            
            // Mark QR code as used
            await this.qrCodesService.markQRCodeUsed(qrCode.id, qrCode.eventId);
            
            // Log the reconciliation
            await this.loggingService.logEvent({
              eventType: 'payment_reconciled',
              source: 'cron_job',
              qrCodeId: qrCode.id,
              eventId: qrCode.eventId,
              eventData: {
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.attributes.status,
                amount: paymentIntent.attributes.amount,
              },
              message: 'Payment reconciled via API check (missed webhook)',
            });
          }
          
          // If payment intent is expired, mark QR code as expired
          if (paymentIntent.attributes.status === 'awaiting_payment_method' && 
              new Date() > new Date(qrCode.expiresAt)) {
            await db
              .update(qrCodes)
              .set({ 
                status: 'expired',
                isActive: false,
                updatedAt: new Date()
              })
              .where(eq(qrCodes.id, qrCode.id));
              
            this.logger.log(`Marked expired QR code ${qrCode.id} via reconciliation`);
          }
          
        } catch (error) {
          this.logger.error(`Failed to reconcile QR code ${qrCode.id}:`, error);
        }
      }
      
      this.logger.log('Webhook reconciliation check completed');
      
    } catch (error) {
      this.logger.error('Reconciliation job failed:', error);
    }
  }

  /**
   * Manual reconciliation for a specific event
   * Can be called via API endpoint if needed
   */
  async reconcileEvent(eventId: string): Promise<{ reconciled: number; errors: number }> {
    const db = this.databaseService.getDb();
    let reconciled = 0;
    let errors = 0;
    
    try {
      // Get all QR codes for this event
      const eventQrCodes = await db
        .select()
        .from(qrCodes)
        .where(eq(qrCodes.eventId, eventId));
      
      for (const qrCode of eventQrCodes) {
        try {
          const paymentIntent = await this.paymongoService.getPaymentIntent(qrCode.paymongoLinkId);
          
          // Update QR code status based on payment intent
          if (paymentIntent.attributes.status === 'succeeded' && qrCode.status !== 'used') {
            await this.qrCodesService.markQRCodeUsed(qrCode.id, qrCode.eventId);
            reconciled++;
          }
        } catch (error) {
          errors++;
          this.logger.error(`Failed to reconcile QR code ${qrCode.id}:`, error);
        }
      }
      
      return { reconciled, errors };
      
    } catch (error) {
      this.logger.error(`Failed to reconcile event ${eventId}:`, error);
      throw error;
    }
  }
}