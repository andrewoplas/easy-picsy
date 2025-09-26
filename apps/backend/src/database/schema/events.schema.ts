import { pgTable, uuid, varchar, text, decimal, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('PHP'),
  isActive: boolean('is_active').notNull().default(false),
  macAddress: varchar('mac_address', { length: 100 }), // MAC address of device activating this event
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lockScreenDesignUrl: text('lock_screen_design_url'),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;