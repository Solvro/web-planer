import { TaskCallback } from "@poppinss/cliui/types";
import { chunkArray, zip } from "@solvro/utils/arrays";
import { Semaphore } from "@solvro/utils/semaphore";
import { DateTime } from "luxon";
import assert from "node:assert";

import { BaseCommand, flags } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import db from "@adonisjs/lucid/services/db";

import Course from "#models/course";
import Department from "#models/department";
import Group from "#models/group";
import Lecturer from "#models/lecturer";
import Registration from "#models/registration";

import {
  ScrapedDepartment,
  scrapCourseNameGroupsUrls,
  scrapCourses,
  scrapDepartments,
  scrapGroupDetails,
  scrapRegistrations,
} from "../app/scrap-registrations/scrap_registrations.js";

function extractLastStringInBrackets(input: string): string | null {
  const regex = /\[([^\]]+)\]/g;
  let match;
  let lastMatch: string | null = null;

  while ((match = regex.exec(input)) !== null) {
    lastMatch = match[1];
  }

  return lastMatch;
}

const QUERY_CHUNK_SIZE = 4096;
type TaskHandle = Parameters<TaskCallback>[0];

export default class Scraper extends BaseCommand {
  static commandName = "scraper";
  static description = "Scrape data from usos pages and insert it to database";

  declare scrapingSemaphore: Semaphore;
  declare dbSemaphore: Semaphore;
  declare departments: ScrapedDepartment[];

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
    staysAlive: false,
  };

  @flags.number({
    alias: ["max-usos"],
    default: 32,
  })
  declare maxUsosRequests: number;

  @flags.number({
    alias: ["max-db"],
    default: 64,
  })
  declare maxDbRequests: number;

  async departmentScrapeTask(task: TaskHandle) {
    task.update("Fetching");
    this.departments = await scrapDepartments();

    task.update("Updating");
    await Promise.all(
      chunkArray(this.departments, QUERY_CHUNK_SIZE).map((chunk) =>
        this.dbSemaphore.runTask(() =>
          Department.updateOrCreateMany(
            "id",
            chunk.map((department) => ({
              id:
                extractLastStringInBrackets(department.name) ?? department.name,
              name: department.name,
              url: department.url,
            })),
          ),
        ),
      ),
    );
  }

  async registrationScrapeTask(task: TaskHandle) {
    task.update("Fetching");
    await Promise.all(
      this.departments.map(async (department) => {
        try {
          department.registrations = await this.scrapingSemaphore.runTask(() =>
            scrapRegistrations(department.url),
          );
        } catch (e) {
          assert(e instanceof Error);
          this.logger.warning(
            `Failed to scrape registrations for '${department.name}': ${e.message}\n${e.stack}`,
          );
        }
      }),
    );

    task.update("Updating");
    // set all registrations to inactive
    await Registration.query().update({ isActive: false });

    // then insert just-scraped ones and set those to active
    const toInsert = this.departments.flatMap((department) =>
      department.registrations.map((registration) => ({
        id: extractLastStringInBrackets(registration.name) ?? registration.name,
        name: registration.name,
        departmentId:
          extractLastStringInBrackets(department.name) ?? department.name,
        isActive: true,
      })),
    );
    await Promise.all(
      chunkArray(toInsert, QUERY_CHUNK_SIZE).map((chunk) =>
        this.dbSemaphore.runTask(() =>
          Registration.updateOrCreateMany("id", chunk),
        ),
      ),
    );
  }

  async courseUrlScrapeTask() {
    await Promise.all(
      this.departments.flatMap((department) =>
        department.registrations.map(async (registration) => {
          let urls;
          try {
            urls = await this.scrapingSemaphore.runTask(() =>
              scrapCourses(registration.url),
            );
          } catch (e: unknown) {
            assert(e instanceof Error);
            this.logger.warning(
              `Failed to scrape course URLs for '${registration.name}': ${e.message}\n${e.stack}`,
            );
            return;
          }
          registration.courses = urls.map((courseUrl) => ({
            url: courseUrl,
            courseCode: "",
            groups: [],
            name: "",
          }));
        }),
      ),
    );
  }

  async courseDetailScrapeTask(task: TaskHandle) {
    task.update("Fetching");
    await Promise.all(
      this.departments.flatMap((department) =>
        department.registrations.flatMap((registration) =>
          registration.courses.map(async (course) => {
            let courseDetails;
            try {
              courseDetails = await this.scrapingSemaphore.runTask(() =>
                scrapCourseNameGroupsUrls(course.url),
              );
            } catch (e) {
              assert(e instanceof Error);
              this.logger.warning(
                `Failed to scrape course details from '${course.url}': ${e.message}\n${e.stack}`,
              );
              return;
            }
            const urls = courseDetails.urls;
            course.courseCode = courseDetails.courseCode;
            course.name = courseDetails.courseName;
            course.groups = urls.map((url) => ({ url, groups: [] }));
          }),
        ),
      ),
    );

    task.update("Updating");
    // set all courses to inactive
    await Course.query().update({ isActive: false });

    // then push new active courses
    const toInsert = this.departments.flatMap((department) =>
      department.registrations.flatMap((registration) =>
        registration.courses.map((course) => ({
          id:
            course.courseCode +
            (extractLastStringInBrackets(registration.name) ??
              registration.name),
          name: course.name,
          registrationId:
            extractLastStringInBrackets(registration.name) ?? registration.name,
          isActive: true,
        })),
      ),
    );
    await Promise.all(
      chunkArray(toInsert, QUERY_CHUNK_SIZE).map((chunk) =>
        this.dbSemaphore.runTask(() => Course.updateOrCreateMany("id", chunk)),
      ),
    );
  }

  async synchronizeArchivesTask() {
    await db.rawQuery(`
      BEGIN;

      -- Update the groups table
      INSERT INTO "groups_archive" ("id", "name", "group", "type", "url", "course_id", "created_at", "updated_at", "spots_occupied", "spots_total", "is_active")
      SELECT "id", "name", "group", "type", "url", "course_id", "created_at", "updated_at", "spots_occupied", "spots_total", "is_active" FROM "groups"
      ON CONFLICT ("id") DO UPDATE SET
      "name" = EXCLUDED."name",
      "group" = EXCLUDED."group",
      "type" = EXCLUDED."type",
      "url" = EXCLUDED."url",
      "course_id" = EXCLUDED."course_id",
      "updated_at" = EXCLUDED."updated_at",
      "spots_occupied" = EXCLUDED."spots_occupied",
      "spots_total" = EXCLUDED."spots_total",
      "is_active" = EXCLUDED."is_active";

      -- Update the lecturers table
      MERGE INTO "group_archive_lecturers" AS "archive"
      USING "group_lecturers" AS "current"
      ON "archive"."group_id" = "current"."group_id" AND "archive"."lecturer_id" = "current"."lecturer_id"
      -- when the row exists in both tables
      WHEN MATCHED THEN DO NOTHING
      -- when the row doesnt exist in the current table
      WHEN NOT MATCHED BY SOURCE
        AND EXISTS (SELECT 1 FROM "groups" WHERE "id" = "archive"."group_id")
        THEN DELETE
      -- when the row doesnt exist in the archive table
      WHEN NOT MATCHED BY TARGET
        THEN INSERT ("group_id", "lecturer_id", "updated_at", "created_at")
        VALUES ("current"."group_id", "current"."lecturer_id", "current"."updated_at", "current"."created_at");

      -- Update the meetings table
      MERGE INTO "group_archive_meetings" AS "archive"
      USING "group_meetings" AS "current"
        ON "current"."group_id" = "archive"."group_id"
        AND "current"."start_time" = "archive"."start_time"
        AND "current"."end_time" = "archive"."end_time"
        AND "current"."week" = "archive"."week"
        AND "current"."day" = "archive"."day"
      -- when the row exists in both tables
      WHEN MATCHED THEN DO NOTHING
      -- when the row doesnt exist in the current table
      WHEN NOT MATCHED BY SOURCE
        AND EXISTS (SELECT 1 FROM "groups" WHERE "id" = "archive"."group_id")
        THEN DELETE
      -- when the row doesnt exist in the archive table
      WHEN NOT MATCHED BY TARGET
        THEN INSERT ("group_id", "start_time", "end_time", "week", "day", "created_at", "updated_at")
        VALUES ("current"."group_id", "current"."start_time", "current"."end_time", "current"."week", "current"."day", "current"."created_at", "current"."updated_at");

      COMMIT;
    `);
  }

  async scrapeGroupsTask(task: TaskHandle) {
    task.update("Fetching");

    const fetchedDetails = await Promise.all(
      this.departments.flatMap((department) =>
        department.registrations.flatMap((registration) =>
          registration.courses.flatMap((course) =>
            course.groups.map(async (group) => {
              const url = group.url;

              let details;
              try {
                details = await this.scrapingSemaphore.runTask(() =>
                  scrapGroupDetails(url),
                );
              } catch (e) {
                assert(e instanceof Error);
                this.logger.warning(
                  `Failed to fetch group details from '${url}': ${e.message}\n${e.stack}`,
                );
                return;
              }

              const lecturers = details.lecturer
                .trim()
                .replace(/\s+/g, " ")
                .slice(0, 255)
                .split(", ");

              return { url, registration, course, details, lecturers };
            }),
          ),
        ),
      ),
    ).then((r) => r.flat().filter((e) => e !== undefined));

    task.update("Updating lecturers");

    // Create a deduplicated list of extracted lecturers
    const lecturerSet = Array.from(
      new Set(fetchedDetails.flatMap(({ lecturers }) => lecturers)),
    );

    // Then fetch/create their IDs from the DB
    // and collect it into a map
    const lecturerMap = new Map<string, number>(
      await Promise.all(
        chunkArray(lecturerSet, QUERY_CHUNK_SIZE).map((chunk) =>
          this.dbSemaphore.runTask(async () =>
            zip(
              chunk,
              await Lecturer.fetchOrCreateMany(
                ["name", "surname"],
                chunk.map((lecturer) => {
                  const [name, ...surnameParts] = lecturer.split(" ");
                  const surname = surnameParts.join(" ");
                  return { name, surname };
                }),
              ).then((r) => r.map((l) => l.id)),
            ),
          ),
        ),
      ).then((r) => r.flat(1)),
    );

    task.update("Updating groups");
    const currentDate = DateTime.now();
    // set all groups to inactive, query below will activate scraped ones
    await Group.query().update({ isActive: false });
    const preparedGroups = fetchedDetails.flatMap(
      ({ url, registration, course, details, lecturers }) => ({
        row: {
          name: details.name.slice(0, 255),
          group: details.group.slice(0, 255),
          type: details.type.slice(0, 255),
          course_id:
            course.courseCode.slice(0, 255) +
            (extractLastStringInBrackets(registration.name) ??
              registration.name),
          spots_occupied: details.spotsOccupied,
          spots_total: details.spotsTotal,
          url: url.slice(0, 255),
          is_active: true,
          created_at: currentDate,
          updated_at: currentDate,
        },
        lecturers,
        meetings: details.meetings,
      }),
    );

    const uniqueRows = Array.from(
      new Map(
        preparedGroups.map(({ row, lecturers, meetings }) => [
          JSON.stringify([row.group, row.type, row.course_id]),
          { row, lecturers, meetings },
        ]),
      ).values(),
    );
    const mergedProps = Array.from(
      new Set(Object.keys(uniqueRows[0].row)).difference(
        new Set(["created_at", "name", "group", "type", "course_id"]),
      ),
    );
    await Promise.all(
      chunkArray(uniqueRows, QUERY_CHUNK_SIZE).map((chunk) =>
        this.dbSemaphore.runTask(async () => {
          // update the main entries
          const ids = (await db
            .knexQuery()
            .insert(chunk.map((el) => el.row))
            .into("groups")
            .onConflict(
              db.knexRawQuery('ON CONSTRAINT "groups_scraper_uindex"'),
            )
            .merge(mergedProps)
            .returning("id")) as { id: number }[];
          const zipped = zip(ids, chunk).map(
            ([{ id }, { lecturers, meetings }]) => ({
              id,
              lecturers,
              meetings,
            }),
          );

          // update meetings
          const meetingData = zipped.flatMap(({ id, meetings }) =>
            meetings.map((m) => ({
              group_id: id,
              start_time: m.startTime,
              end_time: m.endTime,
              week: m.week,
              day: m.day,
            })),
          );
          await db.transaction(async (trx) => {
            await trx.knexRawQuery(`
              CREATE TEMPORARY TABLE "data" (
                "group_id" INTEGER NOT NULL,
                "start_time" TIME NOT NULL,
                "end_time" TIME NOT NULL,
                "week" VARCHAR(255) NOT NULL,
                "day" VARCHAR(255) NOT NULL
              )
              ON COMMIT DROP;
            `);
            await trx.knexQuery().insert(meetingData).into("data");
            // await db.knexRawQuery(
            //   `
            //   INSERT INTO "data" ("group_id", "start_time", "end_time", "week", "day")
            //   VALUES ${Array(meetingsTotal).fill("(?,?,?,?,?)").join(",")};
            // `,
            //   meetingParams,
            // );
            await trx.knexRawQuery(`
              MERGE INTO "group_meetings" AS "gm"
              USING "data" ON "gm"."group_id" = "data"."group_id"
                          AND "gm"."start_time" = "data"."start_time"
                          AND "gm"."end_time" = "data"."end_time"
                          AND "gm"."week" = "data"."week"
                          AND "gm"."day" = "data"."day"
              WHEN NOT MATCHED BY TARGET
                THEN INSERT ("group_id", "start_time", "end_time", "week", "day", "created_at", "updated_at")
                VALUES ("data"."group_id", "data"."start_time", "data"."end_time", "data"."week", "data"."day", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
              WHEN NOT MATCHED BY SOURCE AND EXISTS (SELECT 1 FROM "data" as "d2" WHERE "d2"."group_id" = "gm"."group_id")
                THEN DELETE;
            `);
          });

          // update lecturers
          const lecturerData = zipped.flatMap(({ id, lecturers }) =>
            lecturers.map((l) => ({
              group_id: id,
              lecturer_id: lecturerMap.get(l),
            })),
          );
          await db.transaction(async (trx) => {
            await trx.knexRawQuery(`
              CREATE TEMPORARY TABLE "data" (
                "group_id" INTEGER NOT NULL,
                "lecturer_id" INTEGER NOT NULL
              )
              ON COMMIT DROP;
            `);
            await trx.knexQuery().insert(lecturerData).into("data");
            await trx.knexRawQuery(`
              MERGE INTO "group_lecturers" AS "gl"
              USING "data" ON "gl"."group_id" = "data"."group_id"
                          AND "gl"."lecturer_id" = "data"."lecturer_id"
              WHEN NOT MATCHED BY TARGET
                THEN INSERT ("group_id", "lecturer_id", "created_at", "updated_at")
                VALUES ("data"."group_id", "data"."lecturer_id", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
              WHEN NOT MATCHED BY SOURCE AND EXISTS (SELECT 1 FROM "data" as "d2" WHERE "d2"."group_id" = "gl"."group_id")
                THEN DELETE;
            `);
          });
        }),
      ),
    );
  }

  async vacuumTablesTask(task: TaskHandle) {
    const tables = [
      "departments",
      "registrations",
      "courses",
      "groups_archive",
      "group_archive_lecturers",
      "group_archive_meetings",
      "lecturers",
      "groups",
      "group_lecturers",
      "group_meetings",
    ];

    for (const table of tables) {
      task.update(`Vacuuming '${table}'`);
      await db.rawQuery("VACUUM ANALYZE ??", [table]);
    }
  }

  async run() {
    this.scrapingSemaphore = new Semaphore(this.maxUsosRequests);
    this.dbSemaphore = new Semaphore(this.maxDbRequests);

    await this.ui
      .tasks({ verbose: true })
      .add("Scrape departments", async (task) => {
        await this.departmentScrapeTask(task);
        return "Done";
      })
      .add("Scrape registrations", async (task) => {
        await this.registrationScrapeTask(task);
        return "Done";
      })
      .add("Scrape course URLs", async () => {
        await this.courseUrlScrapeTask();
        return "Done";
      })
      .add("Scrape course details", async (task) => {
        await this.courseDetailScrapeTask(task);
        return "Done";
      })
      .add("Archive current groups", async () => {
        await this.synchronizeArchivesTask();
        return "Done";
      })
      .add("Scrape groups", async (task) => {
        await this.scrapeGroupsTask(task);
        return "Done";
      })
      .add("Vacuum & analyze tables", async (task) => {
        await this.vacuumTablesTask(task);
        return "Done";
      })
      .run();
  }
}
