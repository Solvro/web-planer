import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "groups";

  async up() {
    await this.db.rawQuery(`
      BEGIN;
      WITH "duplicates" AS (
        SELECT MIN("id") AS "id", "name", "start_time", "end_time", "group", "week", "day", "type", "course_id"
        FROM "groups"
        GROUP BY "name", "start_time", "end_time", "group", "week", "day", "type", "course_id"
        HAVING COUNT(*) > 1
      )
      DELETE FROM "groups"
      USING "duplicates"
      WHERE "groups"."id" <> "duplicates"."id"
        AND "groups"."name" = "duplicates"."name"
        AND "groups"."start_time" = "duplicates"."start_time"
        AND "groups"."end_time" = "duplicates"."end_time"
        AND "groups"."group" = "duplicates"."group"
        AND "groups"."week" = "duplicates"."week"
        AND "groups"."day" = "duplicates"."day"
        AND "groups"."type" = "duplicates"."type"
        AND "groups"."course_id" = "duplicates"."course_id";
      ALTER TABLE "groups"
      ADD CONSTRAINT "groups_scraper_uindex"
      UNIQUE ("name", "start_time", "end_time", "group", "week", "day", "type", "course_id");
      COMMIT;
    `);
  }

  async down() {
    await this.db.rawQuery(`
      ALTER TABLE "groups"
      DROP CONSTRAINT "groups_scraper_uindex";
    `);
  }
}
