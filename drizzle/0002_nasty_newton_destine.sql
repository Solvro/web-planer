ALTER TABLE "Schedule" RENAME TO "schedule";--> statement-breakpoint
ALTER TABLE "schedule" DROP CONSTRAINT "Schedule_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;