import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const eventLogs = pgTable('event_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Event metadata
  eventType: text('event_type').notNull(), // qr_generated, payment_success, payment_failed, qr_expired, etc.
  source: text('source').notNull(), // webhook, api, cron_job, manual
  
  // Related entities
  qrCodeId: uuid('qr_code_id'),
  eventId: uuid('event_id'),
  userId: uuid('user_id'),
  
  // Event data
  eventData: jsonb('event_data'), // Structured data about the event
  metadata: jsonb('metadata'), // Additional context/metadata
  
  // Status and outcome
  status: text('status').notNull().default('success'), // success, error, warning
  message: text('message'), // Human readable message
  errorDetails: text('error_details'), // Error information if status is error
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type EventLog = InferSelectModel<typeof eventLogs>;
export type NewEventLog = InferInsertModel<typeof eventLogs>;