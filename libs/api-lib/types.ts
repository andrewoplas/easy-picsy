/**
 * Represents the possible states of a QR code in the system
 * @description
 * - active: QR code is valid and can be scanned
 * - expired: QR code has passed its expiration time
 * - used: QR code has been successfully scanned and processed
 * - invalidated: QR code was manually invalidated or cancelled
 * - paid: Payment for this QR code has been confirmed
 * - failed: Payment or processing failed for this QR code
 */
export enum QrCodeStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  USED = 'used',
  INVALIDATED = 'invalidated',
  PAID = 'paid',
  FAILED = 'failed'
}

/**
 * Represents the subset of QR code statuses used in realtime updates
 * @description Excludes payment-related statuses that are handled separately
 */
export type QrCodeRealtimeStatus = Extract<QrCodeStatus, QrCodeStatus.ACTIVE | QrCodeStatus.EXPIRED | QrCodeStatus.USED | QrCodeStatus.INVALIDATED>;