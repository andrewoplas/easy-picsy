import { Injectable, Logger } from '@nestjs/common';
import { EventsGateway, QRCodeStatusUpdate, PaymentNotification, QRCodeGenerated } from './events.gateway';

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  constructor(private readonly eventsGateway: EventsGateway) {}

  /**
   * Notify about QR code status changes
   */
  notifyQRStatusUpdate(eventId: string, update: QRCodeStatusUpdate) {
    this.logger.log(`Notifying QR status update for event ${eventId}`);
    this.eventsGateway.broadcastQRStatusUpdate(eventId, update);
  }

  /**
   * Notify about payment completion
   */
  notifyPaymentReceived(eventId: string, payment: PaymentNotification) {
    this.logger.log(`Notifying payment received for event ${eventId}`);
    this.eventsGateway.broadcastPaymentNotification(eventId, payment);
  }

  /**
   * Notify about new QR code generation
   */
  notifyQRCodeGenerated(eventId: string, qrCode: QRCodeGenerated) {
    this.logger.log(`Notifying QR code generated for event ${eventId}`);
    this.eventsGateway.broadcastQRCodeGenerated(eventId, qrCode);
  }

  /**
   * Notify about upcoming QR code expiry
   */
  notifyQRExpiryWarning(eventId: string, qrCodeId: string, minutesRemaining: number) {
    this.logger.log(`Notifying QR expiry warning for event ${eventId}: ${minutesRemaining}min`);
    this.eventsGateway.broadcastQRExpiryWarning(eventId, qrCodeId, minutesRemaining);
  }

  /**
   * Notify about connection status changes
   */
  notifyConnectionStatus(status: 'connected' | 'reconnected' | 'error') {
    this.logger.log(`Notifying connection status: ${status}`);
    this.eventsGateway.broadcastConnectionStatus(status);
  }

  /**
   * Notify about successful payment
   */
  notifyPaymentSuccess(eventId: string, payment: {
    qrCodeId: string;
    eventId: string;
    paymentId: string;
    amount: number;
    currency: string;
  }) {
    this.logger.log(`Notifying payment success for event ${eventId}`);
    this.eventsGateway.broadcastPaymentSuccess(eventId, payment);
  }

  /**
   * Notify about failed payment
   */
  notifyPaymentFailed(eventId: string, payment: {
    qrCodeId: string;
    eventId: string;
    paymentId: string;
    failureReason: string;
  }) {
    this.logger.log(`Notifying payment failed for event ${eventId}`);
    this.eventsGateway.broadcastPaymentFailed(eventId, payment);
  }
}