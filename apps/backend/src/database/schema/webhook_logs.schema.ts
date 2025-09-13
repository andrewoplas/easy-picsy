import { pgTable, uuid, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const webhookLogs = pgTable('webhook_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Webhook metadata
  eventType: text('event_type').notNull(), // payment.paid, payment.failed, qrph.expired
  paymongoEventId: text('paymongo_event_id'), // PayMongo's event ID
  paymongoSignature: text('paymongo_signature'), // Webhook signature for verification
  
  // Request data
  requestPayload: jsonb('request_payload').notNull(), // Full webhook payload from PayMongo
  requestHeaders: jsonb('request_headers'), // Request headers for debugging
  
  // Processing details
  status: text('status').notNull().default('received'), // received, processing, completed, failed
  processedAt: timestamp('processed_at'),
  errorMessage: text('error_message'),
  errorStack: text('error_stack'),
  
  // Related entities
  qrCodeId: uuid('qr_code_id'), // Reference to QR code if applicable
  eventId: uuid('event_id'), // Reference to event if applicable
  paymentIntentId: text('payment_intent_id'), // PayMongo payment intent ID
  
  // Verification
  signatureVerified: boolean('signature_verified').default(false),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type WebhookLog = InferSelectModel<typeof webhookLogs>;
export type NewWebhookLog = InferInsertModel<typeof webhookLogs>;