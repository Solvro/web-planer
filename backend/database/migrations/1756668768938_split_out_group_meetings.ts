import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  async up() {
    // Create new tables
    this.schema.createTable("group_meetings", (table) => {
      table.increments("id");
      table.integer("group_id").unsigned().notNullable();
      table
        .foreign("group_id")
        .references("id")
        .inTable("groups")
        .onDelete("CASCADE");

      table.time("start_time").notNullable();
      table.time("end_time").notNullable();
      table.string("week").notNullable();
      table.string("day").notNullable();

      table
        .timestamp("created_at")
        .notNullable()
        // adonis my beloved
        .defaultTo(this.db.getReadClient().raw("CURRENT_TIMESTAMP"));
      table
        .timestamp("updated_at")
        .notNullable()
        .defaultTo(this.db.getReadClient().raw("CURRENT_TIMESTAMP"));
    });
    this.schema.createTable("group_archive_meetings", (table) => {
      table.increments("id");
      table.integer("group_id").unsigned().notNullable();
      table
        .foreign("group_id")
        .references("id")
        .inTable("groups_archive")
        .onDelete("CASCADE");

      table.time("start_time").notNullable();
      table.time("end_time").notNullable();
      table.string("week").notNullable();
      table.string("day").notNullable();

      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(this.db.getReadClient().raw("CURRENT_TIMESTAMP"));
      table
        .timestamp("updated_at")
        .notNullable()
        .defaultTo(this.db.getReadClient().raw("CURRENT_TIMESTAMP"));
    });

    // Create schedule entries for each old group
    this.schema.raw(`
      INSERT INTO "group_meetings" ("group_id", "start_time", "end_time", "week", "day", "created_at", "updated_at")
        SELECT "id", "start_time", "end_time", "week", "day", "created_at", "updated_at" FROM "groups"
        WHERE "start_time" IS NOT NULL AND "end_time" IS NOT NULL AND "week" IS NOT NULL AND "day" IS NOT NULL;
      INSERT INTO "group_archive_meetings" ("group_id", "start_time", "end_time", "week", "day", "created_at", "updated_at")
        SELECT "id", "start_time", "end_time", "week", "day", "created_at", "updated_at" FROM "groups_archive"
        WHERE "start_time" IS NOT NULL AND "end_time" IS NOT NULL AND "week" IS NOT NULL AND "day" IS NOT NULL;
    `);

    // Deduplicate group entries
    this.schema.raw(`
      -- create temp tables
      CREATE TEMPORARY TABLE "group_swaps" (
      "from_id" INTEGER PRIMARY KEY,
      "to_id" INTEGER NOT NULL
      )
      ON COMMIT DROP;

      -- find dupes for current table
      INSERT INTO "group_swaps" ("from_id", "to_id")
      SELECT "groups"."id", "group_dupes"."min_id"
      FROM "groups", (
        SELECT MIN("id") AS "min_id", "group", "type", "course_id" FROM "groups"
        GROUP BY "group", "type", "course_id"
        HAVING COUNT(*) > 1
      ) AS "group_dupes"
      WHERE "groups"."id" <> "group_dupes"."min_id"
        AND "groups"."group" = "group_dupes"."group"
        AND "groups"."type" = "group_dupes"."type"
        AND "groups"."course_id" = "group_dupes"."course_id";

      -- merge duplicated groups
      UPDATE "group_meetings"
      SET "group_id" = "group_swaps"."to_id"
      FROM "group_swaps"
      WHERE "group_meetings"."group_id" = "group_swaps"."from_id";

      DELETE FROM "groups"
      WHERE "id" IN (SELECT "from_id" FROM "group_swaps");

      -- truncate temp tables
      TRUNCATE "group_swaps";

      -- repeat for archive table
      INSERT INTO "group_swaps" ("from_id", "to_id")
      SELECT "groups_archive"."id", "group_dupes"."min_id"
      FROM "groups_archive", (
        SELECT MIN("id") AS "min_id", "group", "type", "course_id" FROM "groups_archive"
        GROUP BY "group", "type", "course_id"
        HAVING COUNT(*) > 1
      ) AS "group_dupes"
      WHERE "groups_archive"."id" <> "group_dupes"."min_id"
        AND "groups_archive"."group" = "group_dupes"."group"
        AND "groups_archive"."type" = "group_dupes"."type"
        AND "groups_archive"."course_id" = "group_dupes"."course_id";

      -- merge duplicated groups
      UPDATE "group_archive_meetings"
      SET "group_id" = "group_swaps"."to_id"
      FROM "group_swaps"
      WHERE "group_archive_meetings"."group_id" = "group_swaps"."from_id";

      DELETE FROM "groups_archive"
      WHERE "id" IN (SELECT "from_id" FROM "group_swaps");
    `);

    // alter group tables
    this.schema.raw(`
      ALTER TABLE "groups"
        -- recreate the unique constraint
        DROP CONSTRAINT "groups_scraper_uindex",
        ADD CONSTRAINT "groups_scraper_uindex"
          UNIQUE ("group","type", "course_id"),
        -- drop migrated columns
        DROP COLUMN "start_time",
        DROP COLUMN "end_time",
        DROP COLUMN "week",
        DROP COLUMN "day";

      -- only drop the columns for archive
      ALTER TABLE "groups_archive"
        DROP COLUMN "start_time",
        DROP COLUMN "end_time",
        DROP COLUMN "week",
        DROP COLUMN "day";
    `);
  }

  async down() {
    // add the columns back
    this.schema.alterTable("groups", (table) => {
      table.time("start_time");
      table.time("end_time");
      table.enum("week", ["-", "TN", "TP"]);
      table.string("day");
    });
    this.schema.alterTable("groups_archive", (table) => {
      table.time("start_time");
      table.time("end_time");
      table.enum("week", ["-", "TN", "TP"]);
      table.string("day");
    });

    // recreate the unique constraint on groups
    this.schema.raw(`
      ALTER TABLE "groups"
        DROP CONSTRAINT "groups_scraper_uindex",
        ADD CONSTRAINT "groups_scraper_uindex"
          UNIQUE ("name", "start_time", "end_time", "group", "week", "day", "type", "course_id");
    `);

    // Migrate data back and reduplicate entries
    this.schema.raw(`
      -- temp tables
      CREATE TEMPORARY TABLE "first_groups" (
        "first_id" INTEGER PRIMARY KEY
      )
      ON COMMIT DROP;

      -- collect the ids of groups that can be safely migrated
      INSERT INTO "first_groups" ("first_id")
      SELECT MIN("id") FROM "group_meetings"
      GROUP BY "group_id";

      -- migrate easy groups
      UPDATE "groups"
      SET "start_time" = "gm"."start_time",
          "end_time" = "gm"."end_time",
          "week" = (CASE WHEN "gm"."week" = '!' THEN '-' ELSE "gm"."week" END),
          "day" = "gm"."day"
      FROM "group_meetings" AS "gm"
      WHERE EXISTS (SELECT 1 FROM "first_groups" WHERE "gm"."id" = "first_groups"."first_id")
        AND "groups"."id" = "gm"."group_id";

      -- reduplicate deduplicated groups
      INSERT INTO "groups" (
        "name", "start_time", "end_time",
        "group", "day",
        "week",
        "type", "url", "course_id",
        "created_at", "updated_at", "spots_occupied",
        "spots_total", "is_active"
      )
      SELECT
        "g"."name", "gm"."start_time", "gm"."end_time",
        "g"."group", "gm"."day",
        (CASE WHEN "gm"."week" = '!' THEN '-' ELSE "gm"."week" END),
        "g"."type", "g"."url", "g"."course_id",
        "gm"."created_at", "gm"."updated_at", "g"."spots_occupied",
        "g"."spots_total", "g"."is_active"
      FROM
        "group_meetings" AS "gm" INNER JOIN "groups" AS "g" ON "gm"."group_id" = "g"."id"
      WHERE NOT EXISTS (SELECT 1 FROM "first_groups" WHERE "gm"."id" = "first_groups"."first_id");

      -- truncate and repeat for archive
      TRUNCATE "first_groups";

      -- collect the ids of groups that can be safely migrated
      INSERT INTO "first_groups" ("first_id")
      SELECT MIN("id") FROM "group_archive_meetings"
      GROUP BY "group_id";

      -- migrate easy groups
      UPDATE "groups_archive"
      SET "start_time" = "gm"."start_time",
          "end_time" = "gm"."end_time",
          "week" = (CASE WHEN "gm"."week" = '!' THEN '-' ELSE "gm"."week" END),
          "day" = "gm"."day"
      FROM "group_archive_meetings" AS "gm"
      WHERE EXISTS (SELECT 1 FROM "first_groups" WHERE "gm"."id" = "first_groups"."first_id")
        AND "groups_archive"."id" = "gm"."group_id";

      -- reduplicate deduplicated groups
      INSERT INTO "groups_archive" (
        "name", "start_time", "end_time",
        "group", "day",
        "week",
        "type", "url", "course_id",
        "created_at", "updated_at", "spots_occupied",
        "spots_total", "is_active"
      )
      SELECT
        "g"."name", "gm"."start_time", "gm"."end_time",
        "g"."group", "gm"."day",
        (CASE WHEN "gm"."week" = '!' THEN '-' ELSE "gm"."week" END),
        "g"."type", "g"."url", "g"."course_id",
        "gm"."created_at", "gm"."updated_at", "g"."spots_occupied",
        "g"."spots_total", "g"."is_active"
      FROM
        "group_archive_meetings" AS "gm" INNER JOIN "groups_archive" AS "g" ON "gm"."group_id" = "g"."id"
      WHERE NOT EXISTS (SELECT 1 FROM "first_groups" WHERE "gm"."id" = "first_groups"."first_id");
    `);

    this.schema.dropTable("group_meetings");
    this.schema.dropTable("group_archive_meetings");
  }
}
