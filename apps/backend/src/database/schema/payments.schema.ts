import { pgTable, uuid, decimal, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { events } from './events.schema';

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('PHP'),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, completed, failed, refunded
  paymongoPaymentId: text('paymongo_payment_id'),
  paymongoLinkId: text('paymongo_link_id'),
  qrCodeId: uuid('qr_code_id'),
  paymentMethod: varchar('payment_method', { length: 50 }), // gcash, grabpay, paymaya, etc.
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;