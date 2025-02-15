import { TaskCallback } from "@poppinss/cliui/types";
import { DateTime } from "luxon";
import assert from "node:assert";

import { BaseCommand, flags } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import db from "@adonisjs/lucid/services/db";

import Course from "#models/course";
import Department from "#models/department";
import Group from "#models/group";
import GroupArchive from "#models/group_archive";
import Lecturer from "#models/lecturer";
import Registration from "#models/registration";

import {
  ScrapedDepartment,
  scrapCourseNameGroupsUrls,
  scrapCourses,
  scrapDepartments,
  scrapGroupDetails,
  scrapGroupsUrls,
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

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result = [];
  const input = Array.from(array);
  while (input.length > 0) {
    result.push(input.splice(0, chunkSize));
  }
  return result;
}

function zip<T1, T2>(a1: T1[], a2: T2[]): [T1, T2][] {
  const array1 = Array.from(a1);
  const array2 = Array.from(a2);
  const result: [T1, T2][] = [];
  while (array1.length > 0 && array2.length > 0) {
    const el1 = array1.shift() as T1;
    const el2 = array2.shift() as T2;
    result.push([el1, el2]);
  }
  return result;
}

const QUERY_CHUNK_SIZE = 4096;
type TaskHandle = Parameters<TaskCallback>[0];

class Semaphore {
  capacity: number;
  #currentTasks: number;
  #waitingTasks: (() => void)[];

  constructor(capacity: number) {
    this.capacity = capacity;
    this.#currentTasks = 0;
    this.#waitingTasks = [];
  }

  public get currentTasks(): number {
    return this.#currentTasks;
  }

  public async runTask<T>(task: () => Promise<T>): Promise<T> {
    // acquire the semaphore
    await this.acquire();
    try {
      // execute the task
      return await task();
    } finally {
      // don't forget to release
      this.release();
    }
  }

  private acquire(): Promise<void> {
    // if we're under capacity, bump the count and resolve immediately
    if (this.capacity > this.#currentTasks) {
      this.#currentTasks += 1;
      return Promise.resolve();
    }
    // otherwise add ourselves to the queue
    return new Promise((resolve) => this.#waitingTasks.push(resolve));
  }

  private release() {
    // try waking up the next task
    const nextTask = this.#waitingTasks.shift();
    if (nextTask === undefined) {
      // no task in queue, decrement task count
      this.#currentTasks -= 1;
    } else {
      // wake up the task
      nextTask();
    }
  }
}

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
            chunk.map((department) => {
              return {
                id:
                  extractLastStringInBrackets(department.name) ??
                  department.name,
                name: department.name,
                url: department.url,
              };
            }),
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
    const toInsert = this.departments.flatMap((department) => {
      return department.registrations.map((registration) => {
        return {
          id:
            extractLastStringInBrackets(registration.name) ?? registration.name,
          name: registration.name,
          departmentId:
            extractLastStringInBrackets(department.name) ?? department.name,
          isActive: true,
        };
      });
    });
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
      this.departments.flatMap((department) => {
        return department.registrations.map(async (registration) => {
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
          registration.courses = urls.map((courseUrl) => {
            return { url: courseUrl, courseCode: "", groups: [], name: "" };
          });
        });
      }),
    );
  }

  async courseDetailScrapeTask(task: TaskHandle) {
    task.update("Fetching");
    await Promise.all(
      this.departments.flatMap((department) => {
        return department.registrations.flatMap((registration) => {
          return registration.courses.map(async (course) => {
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
            course.groups = urls.map((url) => {
              return { url, groups: [] };
            });
          });
        });
      }),
    );

    task.update("Updating");
    // set all courses to inactive
    await Course.query().update({ isActive: false });

    // then push new active courses
    const toInsert = this.departments.flatMap((department) => {
      return department.registrations.flatMap((registration) =>
        registration.courses.map((course) => {
          return {
            id:
              course.courseCode +
              (extractLastStringInBrackets(registration.name) ??
                registration.name),
            name: course.name,
            registrationId:
              extractLastStringInBrackets(registration.name) ??
              registration.name,
            isActive: true,
          };
        }),
      );
    });
    await Promise.all(
      chunkArray(toInsert, QUERY_CHUNK_SIZE).map((chunk) =>
        this.dbSemaphore.runTask(() => Course.updateOrCreateMany("id", chunk)),
      ),
    );
  }

  async synchronizeArchivesTask(task: TaskHandle) {
    task.update("Synchronizing archived groups");
    const currentGroups = await Group.all();

    const archivedGroups = await Promise.all(
      chunkArray(currentGroups, QUERY_CHUNK_SIZE).map((chunk) =>
        this.dbSemaphore.runTask(() =>
          GroupArchive.updateOrCreateMany(
            "id",
            chunk.map((g) => g.$attributes),
          ),
        ),
      ),
    ).then((a) => a.flat());

    task.update("Synchronizing archived group lecturers");
    await Promise.all(
      zip(currentGroups, archivedGroups).map(([group, groupArchive]) =>
        this.dbSemaphore.runTask(async () => {
          const lecturers = await group.related("lecturers").query();

          await groupArchive
            .related("lecturers")
            .sync(lecturers.map((lecturer) => lecturer.id));
        }),
      ),
    );
  }

  async scrapeGroupsTask(task: TaskHandle) {
    task.update("Fetching");

    const fetchedDetails = await Promise.all(
      this.departments.flatMap((department) =>
        department.registrations.flatMap((registration) =>
          registration.courses.flatMap((course) =>
            course.groups.map(async (group) => {
              let urls;
              try {
                urls = await this.scrapingSemaphore.runTask(() =>
                  scrapGroupsUrls(group.url),
                );
              } catch (e) {
                assert(e instanceof Error);
                this.logger.warning(
                  `Failed to fetch group detail URLs from '${group.url}': ${e.message}\n${e.stack}`,
                );
                return;
              }

              return await Promise.all(
                urls.map(async (url) => {
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
              );
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
    const lecturersToInsert = lecturerSet.map((lecturer) => {
      const [name, ...surnameParts] = lecturer.split(" ");
      const surname = surnameParts.join(" ");
      return { name, surname };
    });
    const lecturersIds = await Promise.all(
      chunkArray(lecturersToInsert, QUERY_CHUNK_SIZE).map((chunk) =>
        this.dbSemaphore.runTask(() =>
          Lecturer.fetchOrCreateMany(["name", "surname"], chunk),
        ),
      ),
    ).then((a) => a.flat().map((l) => l.id));

    // Finally, create a map of lecturer name to ID
    const lecturerMap = new Map(zip(lecturerSet, lecturersIds));

    task.update("Updating groups");
    const currentDate = DateTime.now();
    // set all groups to inactive, query below will activate scraped ones
    await Group.query().update({ isActive: false });
    const preparedGroups = fetchedDetails.flatMap(
      ({ url, registration, course, details, lecturers }) =>
        details.days.map((day) => {
          return {
            row: {
              name: details.name.slice(0, 255),
              start_time: details.startTimeEndTimes[
                details.days.indexOf(day)
              ].startTime.slice(0, 255),
              end_time: details.startTimeEndTimes[
                details.days.indexOf(day)
              ].endTime.slice(0, 255),
              group: details.group.slice(0, 255),
              week: details.week as "-" | "TP" | "TN",
              day: day.slice(0, 255),
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
          };
        }),
    );

    const uniqueRows = Array.from(
      new Map(
        preparedGroups.map(({ row, lecturers }) => [
          JSON.stringify([
            row.name,
            row.start_time,
            row.end_time,
            row.group,
            row.week,
            row.day,
            row.type,
            row.course_id,
          ]),
          { row, lecturers },
        ]),
      ).values(),
    );
    const mergedProps = Array.from(
      new Set(Object.keys(uniqueRows[0].row)).difference(
        new Set([
          "created_at",
          "name",
          "start_time",
          "end_time",
          "group",
          "week",
          "day",
          "type",
          "course_id",
        ]),
      ),
    );
    const groups = await Promise.all(
      chunkArray(uniqueRows, QUERY_CHUNK_SIZE).map((chunk) =>
        this.dbSemaphore.runTask(async () => {
          const ids = (await db
            .knexQuery()
            .insert(chunk.map((el) => el.row))
            .into("groups")
            .onConflict(
              db.knexRawQuery('ON CONSTRAINT "groups_scraper_uindex"'),
            )
            .merge(mergedProps)
            .returning("id")) as { id: number }[];
          const updatedGroups = await Group.findMany(ids.map((i) => i.id));
          return zip(updatedGroups, chunk).map(([group, { lecturers }]) => {
            return { group, lecturers };
          });
          //Group.updateOrCreateMany(
          //  ["url", "startTime", "day", "week", "courseId"],
          //  chunk,
          //),
        }),
      ),
    ).then((a) => a.flat());

    task.update("Updating group lecturers");
    await Promise.all(
      groups.map(({ group, lecturers }) =>
        this.dbSemaphore.runTask(async () => {
          const ids = lecturers.map((lecturer) => {
            const id = lecturerMap.get(lecturer);
            assert(id !== undefined);
            return id;
          });
          await group.related("lecturers").sync(ids);
        }),
      ),
    );
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
      .add("Archive current groups", async (task) => {
        await this.synchronizeArchivesTask(task);
        return "Done";
      })
      .add("Scrape groups", async (task) => {
        await this.scrapeGroupsTask(task);
        return "Done";
      })
      .run();
  }
}
