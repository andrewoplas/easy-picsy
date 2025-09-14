import { pgTable, uuid, text, timestamp, varchar, boolean, integer } from 'drizzle-orm/pg-core';
import { events } from './events.schema';
import { payments } from './payments.schema';

export const qrCodes = pgTable('qr_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  sessionId: uuid('session_id'), // Will link to sessions table in Module 6
  paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'set null' }),
  qrData: text('qr_data').notNull(), // The actual QR code content/URL
  paymongoLinkId: text('paymongo_link_id').notNull(), // Paymongo payment intent ID
  paymongoLinkUrl: text('paymongo_link_url').notNull(), // Paymongo payment link URL
  paymongoQrphId: text('paymongo_qrph_id'), // Paymongo QR Ph resource ID (for expiry tracking)
  status: varchar('status', { length: 20 }).notNull().default('active').$type<'active' | 'expired' | 'used' | 'invalidated' | 'paid' | 'failed'>(), // active, expired, used, invalidated, paid, failed
  expiresAt: timestamp('expires_at').notNull(),
  usageCount: integer('usage_count').notNull().default(0), // Track how many times QR was scanned
  maxUsage: integer('max_usage').notNull().default(1), // Single use by default
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  usedAt: timestamp('used_at'),
  invalidatedAt: timestamp('invalidated_at'),
});

export type QrCodeStatus = 'active' | 'expired' | 'used' | 'invalidated' | 'paid' | 'failed';

export type QrCode = typeof qrCodes.$inferSelect;
export type NewQrCode = typeof qrCodes.$inferInsert;