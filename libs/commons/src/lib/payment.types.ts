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
