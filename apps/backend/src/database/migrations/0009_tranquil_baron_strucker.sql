ALTER TABLE "events" ALTER COLUMN "is_active" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "mac_address" varchar(100);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "mac_address";