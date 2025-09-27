/**
 * Represents the possible states of a QR code in the system
 * @description
 * - active: QR code is valid and can be scanned
 * - expired: QR code has passed its expiration time
 * - paid: Payment has been confirmed
 * - session_completed: Booth session has finished successfully
 * - invalidated: QR code was manually invalidated or cancelled
 * - failed: Payment or processing failed for this QR code
 */
export enum QrCodeStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PAID = 'paid',
  SESSION_COMPLETED = 'completed',
  INVALIDATED = 'invalidated',
  FAILED = 'failed'
}

/**
 * Represents the subset of QR code statuses used in realtime updates
 * @description Excludes payment-related statuses that are handled separately
 */
export type QrCodeRealtimeStatus = Extract<
  QrCodeStatus,
  | QrCodeStatus.ACTIVE
  | QrCodeStatus.EXPIRED
  | QrCodeStatus.PAID
  | QrCodeStatus.SESSION_COMPLETED
  | QrCodeStatus.INVALIDATED
>;