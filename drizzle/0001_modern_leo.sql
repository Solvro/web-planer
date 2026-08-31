CREATE TABLE "Schedule" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"courses" json,
	"registrations" json,
	"groups" json,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;