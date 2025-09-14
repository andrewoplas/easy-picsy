CREATE TABLE "webhook_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"paymongo_event_id" text,
	"paymongo_signature" text,
	"request_payload" jsonb NOT NULL,
	"request_headers" jsonb,
	"status" text DEFAULT 'received' NOT NULL,
	"processed_at" timestamp,
	"error_message" text,
	"error_stack" text,
	"qr_code_id" uuid,
	"event_id" uuid,
	"payment_intent_id" text,
	"signature_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"source" text NOT NULL,
	"qr_code_id" uuid,
	"event_id" uuid,
	"user_id" uuid,
	"event_data" jsonb,
	"metadata" jsonb,
	"status" text DEFAULT 'success' NOT NULL,
	"message" text,
	"error_details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "qr_codes" RENAME COLUMN "paymongo_link_id" TO "payment_intent_id";--> statement-breakpoint
ALTER TABLE "qr_codes" ALTER COLUMN "paymongo_link_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "qr_codes" ADD COLUMN "paymongo_qrph_id" text;