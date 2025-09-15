CREATE TABLE "booth_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"booth_event_type" text NOT NULL,
	"timestamp" text NOT NULL,
	"param1" text,
	"param2" text,
	"param3" text,
	"param4" text,
	"event_id" uuid,
	"qr_code_id" uuid,
	"booth_identifier" text,
	"status" text DEFAULT 'success' NOT NULL,
	"message" text,
	"error_details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booth_logs" ADD CONSTRAINT "booth_logs_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booth_logs" ADD CONSTRAINT "booth_logs_qr_code_id_qr_codes_id_fk" FOREIGN KEY ("qr_code_id") REFERENCES "public"."qr_codes"("id") ON DELETE set null ON UPDATE no action;