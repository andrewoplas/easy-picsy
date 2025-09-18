import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { events } from './events.schema';
import { qrCodes } from './qr_codes.schema';
import { BoothStatus } from '@org/commons';

export const boothLogs = pgTable('booth_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Core booth session data
  sessionId: text('session_id').notNull(), // Client-generated session identifier
  boothEventType: text('booth_event_type').notNull(), // Enum values enforced at application level
  timestamp: text('timestamp').notNull(), // Original booth timestamp format: "16:20:7.287"
  
  // Event parameters (preserving original booth event structure)
  param1: text('param1'),
  param2: text('param2'),
  param3: text('param3'),
  param4: text('param4'),
  
  // Related entities (referencing existing tables)
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }), // The photo booth event/package
  qrCodeId: uuid('qr_code_id').references(() => qrCodes.id, { onDelete: 'set null' }), // Associated QR code
  
  // Booth context (since we don't have booth entity, store as text)
  boothIdentifier: text('booth_identifier'), // Physical booth ID/name (e.g., "Booth-1", "Main-Booth")
  
  // Status and diagnostics
  status: text('status').notNull().default(BoothStatus.SUCCESS), // Enum values enforced at application level
  message: text('message'), // Human-readable description
  errorDetails: text('error_details'), // Error information if status is error
  
  // Timing
  createdAt: timestamp('created_at').defaultNow().notNull(), // When we received/processed this event
});

export type BoothLog = InferSelectModel<typeof boothLogs>;
export type NewBoothLog = InferInsertModel<typeof boothLogs>;