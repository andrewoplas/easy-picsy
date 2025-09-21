import { pgTable, uuid, text, timestamp, varchar, boolean, integer } from 'drizzle-orm/pg-core';
import { events } from './events.schema';
import { payments } from './payments.schema';
import { QrCodeStatus } from '@org/commons';

export const qrCodes = pgTable('qr_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  sessionId: text('session_id'), // Client-generated session identifier
  paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'set null' }),
  qrData: text('qr_data').notNull(), // The actual QR code content/URL
  paymentIntentId: text('payment_intent_id').notNull(), // PayMongo Payment Intent ID for QR Ph payments
  paymongoLinkUrl: text('paymongo_link_url'), // Legacy: PayMongo payment link URL (deprecated)
  paymongoQrphId: text('paymongo_qrph_id'), // Paymongo QR Ph resource ID (for expiry tracking)
  status: varchar('status', { length: 20 }).notNull().default(QrCodeStatus.ACTIVE).$type<`${QrCodeStatus}`>(),
  expiresAt: timestamp('expires_at').notNull(),
  usageCount: integer('usage_count').notNull().default(0),
  maxUsage: integer('max_usage').notNull().default(1),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  usedAt: timestamp('used_at'),
  invalidatedAt: timestamp('invalidated_at'),
});

export type QrCode = typeof qrCodes.$inferSelect;
export type NewQrCode = typeof qrCodes.$inferInsert;