import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';
import { QrCodesService } from '../qr-codes/qr-codes.service';
import { RealtimeService } from '../realtime/realtime.service';
import { LoggingService } from '../logging/logging.service';
import { qrCodes, webhookLogs } from '../database/schema';
import { eq } from 'drizzle-orm';
import * as crypto from 'crypto';

interface PaymongoWebhookPayload {
  data: PaymongoWebhookEvent;
}

interface PaymongoWebhookEvent {
  id: string;
  type: 'event';
  attributes: {
    type: 'payment.paid' | 'payment.failed' | 'qrph.expired';
    livemode: boolean;
    data: PaymongoPaymentData | PaymongoQRPhData;
    previous_data?: any;
    pending_webhooks?: number;
    created_at: number;
    updated_at: number;
  };
}

interface PaymongoPaymentData {
  id: string;
  type: 'payment';
  attributes: {
    access_url: string | null;
    amount: number;
    balance_transaction_id: string | null;
    billing: {
      address: {
        city: string;
        country: string;
        line1: string;
        line2: string;
        postal_code: string;
        state: string;
      };
      email: string;
      name: string;
      phone: string;
    };
    currency: string;
    description: string;
    disputed: boolean;
    external_reference_number: string | null;
    fee: number;
    foreign_fee: number;
    instant_settlement: any | null;
    livemode: boolean;
    net_amount: number;
    origin: string;
    payment_intent_id: string;
    payout: any | null;
    source: {
      id: string;
      type: string;
      brand?: string;
      country?: string;
      last4?: string;
    };
    statement_descriptor: string;
    status: 'paid' | 'failed';
    tax_amount: number;
    metadata: Record<string, any> | null;
    promotion: any | null;
    refunds: any[];
    taxes: any[];
    available_at: number;
    created_at: number;
    credited_at: number;
    paid_at: number;
    updated_at: number;
    failed_code?: string;
    failed_message?: string;
  };
}

interface PaymongoQRPhData {
  id: string;
  type: 'qrph';
  attributes: {
    code_id: string;
    livemode: boolean;
    organization_id: string;
    created_at: string;
    source_id: string;
    source_status: 'expired';
    payment_intent_id: string;
  };
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly webhookSecret: string;

  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
    private qrCodesService: QrCodesService,
    private realtimeService: RealtimeService,
    private loggingService: LoggingService,
  ) {
    this.webhookSecret = this.configService.get<string>('PAYMONGO_WEBHOOK_SECRET') as string;
  }

  /**
   * Verify PayMongo webhook signature
   */
  async verifyWebhookSignature(payload: any, signature: string): Promise<void> {
    if (!this.webhookSecret) {
      this.logger.warn('Webhook secret not configured, skipping signature verification');
      return;
    }

    if (!signature) {
      this.logger.error('Missing webhook signature');
      throw new UnauthorizedException('Missing webhook signature');
    }

    try {
      // PayMongo sends signature in format: t=timestamp,te=test_mode_signature,li=live_mode_signature
      const signatureParts = signature.split(',');
      const timestamp = signatureParts.find(part => part.startsWith('t='))?.replace('t=', '');
      const testSignature = signatureParts.find(part => part.startsWith('te='))?.replace('te=', '');
      const liveSignature = signatureParts.find(part => part.startsWith('li='))?.replace('li=', '');

      this.logger.log('Webhook signature parts:', { timestamp, hasTestSig: !!testSignature, hasLiveSig: !!liveSignature });

      // Create the signature payload: timestamp.payload
      const signaturePayload = `${timestamp}.${JSON.stringify(payload)}`;

      // Calculate expected signature
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(signaturePayload)
        .digest('hex');

      // Check if we're in test mode or live mode
      // PayMongo test webhook secrets usually start with 'whsk_' or contain 'test'
      const isTestMode = this.webhookSecret.includes('test') || !this.webhookSecret.startsWith('whpk_');
      const receivedSignature = isTestMode ? testSignature : liveSignature;

      this.logger.log('Signature verification:', {
        isTestMode,
        receivedSig: receivedSignature?.substring(0, 10) + '...',
        expectedSig: expectedSignature.substring(0, 10) + '...'
      });

      if (!receivedSignature || receivedSignature !== expectedSignature) {
        this.logger.error('Invalid webhook signature', {
          received: receivedSignature?.substring(0, 20),
          expected: expectedSignature.substring(0, 20)
        });
        throw new UnauthorizedException('Invalid webhook signature');
      }

      // Verify timestamp to prevent replay attacks (optional but recommended)
      const webhookTimestamp = parseInt(timestamp || '0', 10);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const timeDifference = currentTimestamp - webhookTimestamp;

      // Reject if webhook is older than 5 minutes
      if (timeDifference > 300) {
        this.logger.warn('Webhook timestamp too old', { timeDifference });
        throw new UnauthorizedException('Webhook timestamp too old');
      }

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Error verifying webhook signature:', error);
      throw new UnauthorizedException('Failed to verify webhook signature');
    }
  }

  /**
   * Process PayMongo webhook events
   */
  async processWebhookEvent(payload: PaymongoWebhookPayload, requestHeaders?: any) {
    // Log the raw payload for debugging
    this.logger.log('Processing webhook payload:', {
      eventId: payload.data.id,
      eventType: payload.data.type,
      webhookEventType: payload.data.attributes.type,
      hasData: !!payload.data.attributes.data,
      livemode: payload.data.attributes.livemode,
    });

    // PayMongo webhook structure: { data: { id, type, attributes: { type, data: {...} } } }
    const event = payload.data;

    if (!event || !event.attributes) {
      this.logger.error('Invalid webhook payload structure:', {
        payload: JSON.stringify(payload).substring(0, 500),
        eventKeys: event ? Object.keys(event) : null,
      });
      throw new Error('Invalid webhook payload structure');
    }

    const eventType = event.attributes.type;
    const eventData = event.attributes.data;

    // Log the webhook first
    const webhookLogId = await this.loggingService.logWebhook({
      eventType,
      paymongoEventId: payload.data.id,
      paymongoSignature: requestHeaders?.['paymongo-signature'],
      requestPayload: payload,
      requestHeaders,
      paymentIntentId: eventData?.attributes?.payment_intent_id || eventData?.id,
      signatureVerified: true, // We verified it before reaching here
    });

    try {
      await this.loggingService.updateWebhookLog(webhookLogId, 'processing');

      this.logger.log(`Processing webhook event: ${eventType}`, {
        eventId: payload.data.id,
        dataId: eventData?.id,
        dataType: eventData?.type,
        webhookLogId,
        paymentIntentId: eventData?.attributes?.payment_intent_id,
      });

      switch (eventType) {
        case 'payment.paid':
          if (eventData?.type === 'payment') {
            await this.handlePaymentPaid(eventData as PaymongoPaymentData, webhookLogId);
          } else {
            this.logger.error(`Expected payment data for payment.paid event, got: ${eventData?.type}`);
          }
          break;

        case 'payment.failed':
          if (eventData?.type === 'payment') {
            await this.handlePaymentFailed(eventData as PaymongoPaymentData, webhookLogId);
          } else {
            this.logger.error(`Expected payment data for payment.failed event, got: ${eventData?.type}`);
          }
          break;

        case 'qrph.expired':
          if (eventData?.type === 'qrph') {
            await this.handleQRExpired(eventData as PaymongoQRPhData, webhookLogId);
          } else {
            this.logger.error(`Expected qrph data for qrph.expired event, got: ${eventData?.type}`);
          }
          break;

        default:
          this.logger.warn(`Unhandled webhook event type: ${eventType}`);
          await this.loggingService.updateWebhookLog(webhookLogId, 'completed', 'Unhandled event type');
          return;
      }

      await this.loggingService.updateWebhookLog(webhookLogId, 'completed');

    } catch (error) {
      this.logger.error(`Failed to process webhook ${eventType}:`, error);
      await this.loggingService.updateWebhookLog(
        webhookLogId,
        'failed',
        (error as Error).message,
        (error as Error).stack
      );
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentPaid(paymentData: PaymongoPaymentData, webhookLogId: string): Promise<void> {
    // PayMongo sends the payment object in the data field
    // The payment intent ID is nested in: paymentData.attributes.payment_intent_id
    const paymentIntentId = paymentData.attributes.payment_intent_id;
    const paymentId = paymentData.id;
    const origin = paymentData.attributes.origin;

    this.logger.log(`Processing payment.paid for payment intent: ${paymentIntentId}`, {
      paymentId,
      paymentIntentId,
      origin,
      dataType: paymentData.type,
      hasAttributes: !!paymentData.attributes,
      status: paymentData.attributes?.status,
      amount: paymentData.attributes?.amount,
      currency: paymentData.attributes?.currency,
    });

    try {
      const db = this.databaseService.getDb();
      let qrCode = null;

      if (paymentIntentId) {
        // QR Ph payment via Payment Intent (this is what we want)
        this.logger.log(`Looking for QR code with Payment Intent ID: ${paymentIntentId}`);
        [qrCode] = await db
          .select()
          .from(qrCodes)
          .where(eq(qrCodes.paymentIntentId, paymentIntentId))
          .limit(1);
      } else {
        // Handle legacy payment link cases (should not happen anymore)
        this.logger.warn(`Payment without payment_intent_id (origin: ${origin}), this should not happen with QR Ph only flow`);
        return;
      }

      if (!qrCode) {
        this.logger.warn(`QR code not found for payment intent: ${paymentIntentId}`, {
          searchField: 'paymentIntentId',
          paymentIntentId,
          paymentId,
          origin,
          dataStructure: Object.keys(paymentData.attributes),
        });
        
        // Debug: Let's see what QR codes exist
        const allActiveQrCodes = await db
          .select()
          .from(qrCodes)
          .where(eq(qrCodes.status, 'active'))
          .limit(5);
        
        this.logger.debug('Active QR codes in database:', {
          count: allActiveQrCodes.length,
          qrCodes: allActiveQrCodes.map(qr => ({
            id: qr.id,
            paymentIntentId: qr.paymentIntentId,
            status: qr.status,
            createdAt: qr.createdAt
          }))
        });
        return;
      }

      this.logger.log(`Found QR code ${qrCode.id} for payment intent ${paymentIntentId}`);
      await this.processPaymentSuccess(qrCode, paymentData, webhookLogId, db);

    } catch (error) {
      this.logger.error(`Failed to handle payment success for ${paymentIntentId}:`, error);
    }
  }

  /**
   * Process successful payment for a QR code
   */
  private async processPaymentSuccess(qrCode: any, paymentData: any, webhookLogId: string, db: any): Promise<void> {
    try { // Update webhook log with QR code and event references
      await this.loggingService.updateWebhookLog(webhookLogId, 'processing');
      await db
        .update(webhookLogs)
        .set({
          qrCodeId: qrCode.id,
          eventId: qrCode.eventId,
          updatedAt: new Date(),
        })
        .where(eq(webhookLogs.id, webhookLogId));

      // Mark QR code as paid
      await this.qrCodesService.markQRCodePaid(qrCode.id, qrCode.eventId);

      this.logger.log(`Payment successful for QR code: ${qrCode.id}`);

      // Log the payment success event
      await this.loggingService.logEvent({
        eventType: 'payment_success',
        source: 'webhook',
        qrCodeId: qrCode.id,
        eventId: qrCode.eventId,
        eventData: {
          paymentId: paymentData.id,
          amount: paymentData.attributes.amount,
          currency: paymentData.attributes.currency,
        },
        metadata: {
          webhookLogId,
          paymentIntentId: paymentData.id,
        },
        message: `Payment successful for ${paymentData.attributes.amount / 100} ${paymentData.attributes.currency}`,
      });

      // Broadcast payment success
      this.realtimeService.notifyPaymentSuccess(qrCode.eventId, {
        qrCodeId: qrCode.id,
        eventId: qrCode.eventId,
        paymentId: paymentData.id,
        amount: paymentData.attributes.amount,
        currency: paymentData.attributes.currency,
      });

    } catch (error) {
      this.logger.error(`Failed to handle payment success for ${paymentData.attributes.payment_intent_id}:`, error);
    }
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(paymentData: PaymongoPaymentData, webhookLogId: string): Promise<void> {
    const paymentIntentId = paymentData.attributes.payment_intent_id;
    const paymentId = paymentData.id;

    try {
      // Find QR code by payment intent ID
      let db = this.databaseService.getDb();
      const [qrCode] = await db
        .select()
        .from(qrCodes)
        .where(eq(qrCodes.paymentIntentId, paymentIntentId))
        .limit(1);

      if (!qrCode) {
        this.logger.warn(`QR code not found for payment intent: ${paymentIntentId}`, {
          searchField: 'paymentIntentId',
          paymentIntentId,
          paymentId,
          failureReason: paymentData.attributes.failed_message,
        });
        return;
      }

      this.logger.log(`Payment failed for QR code: ${qrCode.id}`, {
        paymentId,
        paymentIntentId,
        failureReason: paymentData.attributes.failed_message,
        failureCode: paymentData.attributes.failed_code,
      });

      // Mark QR code as failed
      await this.qrCodesService.markQRCodeFailed(qrCode.id, qrCode.eventId, paymentData.attributes.failed_message);

      // Update webhook log with QR code and event references
      await this.loggingService.updateWebhookLog(webhookLogId, 'processing');
      db = this.databaseService.getDb();
      await db
        .update(webhookLogs)
        .set({
          qrCodeId: qrCode.id,
          eventId: qrCode.eventId,
          updatedAt: new Date(),
        })
        .where(eq(webhookLogs.id, webhookLogId));

      // Log the payment failure event
      await this.loggingService.logEvent({
        eventType: 'payment_failed',
        source: 'webhook',
        qrCodeId: qrCode.id,
        eventId: qrCode.eventId,
        status: 'error',
        eventData: {
          paymentId: paymentData.id,
          failureReason: paymentData.attributes.failed_message || 'Payment failed',
          failureCode: paymentData.attributes.failed_code,
        },
        metadata: {
          webhookLogId,
          paymentIntentId,
        },
        message: `Payment failed: ${paymentData.attributes.failed_message || 'Unknown error'}`,
        errorDetails: JSON.stringify({ 
          failed_code: paymentData.attributes.failed_code, 
          failed_message: paymentData.attributes.failed_message 
        }),
      });

      // Broadcast payment failure
      this.realtimeService.notifyPaymentFailed(qrCode.eventId, {
        qrCodeId: qrCode.id,
        eventId: qrCode.eventId,
        paymentId: paymentData.id,
        failureReason: paymentData.attributes.failed_message || 'Payment failed',
      });

    } catch (error) {
      this.logger.error(`Failed to handle payment failure for ${paymentIntentId}:`, error);
    }
  }

  /**
   * Handle QR code expiration
   */
  private async handleQRExpired(qrData: PaymongoQRPhData, webhookLogId: string): Promise<void> {
    try {
      // QR expiration references the QR Ph resource ID (qrph_xxx)
      const qrphId = qrData.id;
      
      this.logger.log(`Processing qrph.expired for QR Ph: ${qrphId}`, {
        dataType: qrData.type,
        hasAttributes: !!qrData.attributes,
      });
      
      if (!qrphId) {
        this.logger.warn('No QR Ph ID found in QR expiration event');
        return;
      }

      // Find QR code by QR Ph ID
      const db = this.databaseService.getDb();
      const [qrCode] = await db
        .select()
        .from(qrCodes)
        .where(eq(qrCodes.paymongoQrphId, qrphId))
        .limit(1);

      if (!qrCode) {
        this.logger.warn(`QR code not found for QR Ph ID: ${qrphId}`, {
          searchField: 'paymongoQrphId',
          qrphId,
        });
        return;
      }

      this.logger.log(`QR code expired: ${qrCode.id}`);

      // Update webhook log with QR code and event references
      await db
        .update(webhookLogs)
        .set({ 
          qrCodeId: qrCode.id, 
          eventId: qrCode.eventId,
          updatedAt: new Date(),
        })
        .where(eq(webhookLogs.id, webhookLogId));

      // Log the QR expiration event
      await this.loggingService.logEvent({
        eventType: 'qr_expired',
        source: 'webhook',
        qrCodeId: qrCode.id,
        eventId: qrCode.eventId,
        eventData: {
          qrphId: qrphId,
        },
        metadata: {
          webhookLogId,
        },
        message: `QR Ph expired: ${qrphId}`,
      });

      // Broadcast QR code status update
      this.realtimeService.notifyQRStatusUpdate(qrCode.eventId, {
        qrCodeId: qrCode.id,
        eventId: qrCode.eventId,
        status: 'expired',
      });

    } catch (error) {
      this.logger.error('Failed to handle QR expiration:', error);
    }
  }
}