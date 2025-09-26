/**
 * Represents the possible states of a payment in the system
 * @description Used to track payment lifecycle
 */
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

/**
 * Represents the supported payment methods
 * @description Payment providers available in the system
 */
export enum PaymentMethod {
  GCASH = 'gcash',
  GRABPAY = 'grabpay',
  PAYMAYA = 'paymaya',
  QRPH = 'qrph',
}

/**
 * Represents a payment record in the database
 * @description Complete payment record with all metadata
 */
export interface Payment {
  id: string;
  eventId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymongoPaymentId?: string | null;
  paymongoLinkId?: string | null;
  qrCodeId?: string | null;
  paymentMethod?: PaymentMethod | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a simplified transaction for the frontend
 * @description Used in transaction history and summaries
 */
export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  status: PaymentStatus;
  sessionId: string;
  paymentMethod: PaymentMethod;
}

/**
 * Webhook event types from PayMongo
 * @description Supported webhook events for payment processing
 */
export enum WebhookEventType {
  PAYMENT_PAID = 'payment.paid',
  PAYMENT_FAILED = 'payment.failed',
  QRPH_EXPIRED = 'qrph.expired',
}

/**
 * PayMongo data types in webhook payloads
 * @description Data structure types in webhook events
 */
export enum PaymongoDataType {
  QRPH = 'qrph',
  PAYMENT = 'payment',
  EVENT = 'event',
}

/**
 * Payment success event types for logging
 * @description Internal event types for payment processing
 */
export enum PaymentEventType {
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILURE = 'payment_failure',
  QR_CODE_EXPIRED = 'qr_code_expired',
}
