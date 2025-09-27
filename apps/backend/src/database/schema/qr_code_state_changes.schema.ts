import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { qrCodes } from './qr_codes.schema';
import { QrCodeStatus } from '@org/commons';

export const qrCodeStateChanges = pgTable('qr_code_state_changes', {
  id: uuid('id').primaryKey().defaultRandom(),
  qrCodeId: uuid('qr_code_id').notNull().references(() => qrCodes.id, { onDelete: 'cascade' }),
  fromState: varchar('from_state', { length: 50 }).$type<`${QrCodeStatus}`>(),
  toState: varchar('to_state', { length: 50 }).notNull().$type<`${QrCodeStatus}`>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type QrCodeStateChange = typeof qrCodeStateChanges.$inferSelect;
export type NewQrCodeStateChange = typeof qrCodeStateChanges.$inferInsert;
