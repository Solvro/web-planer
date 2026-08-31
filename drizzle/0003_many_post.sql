ALTER TABLE "schedule" ALTER COLUMN "courses" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule" ALTER COLUMN "registrations" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule" ALTER COLUMN "groups" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "public_snapshot" json;