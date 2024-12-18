import { BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";

import {
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

export default class Scraper extends BaseCommand {
  static commandName = "scraper";
  static description = "Scrap data from usos pages and insert it to database";

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
    staysAlive: false,
  };

  async run() {
    const DepartmentModule = await import('#models/department')
    const Department = DepartmentModule.default
    const RegistrationModule = await import('#models/registration')
    const Registration = RegistrationModule.default
    const CourseModule = await import('#models/course')
    const Course = CourseModule.default
    const GroupModule = await import('#models/group')
    const Group = GroupModule.default
    const GroupArchiveModule = await import('#models/group_archive')
    const GroupArchive = GroupArchiveModule.default

    this.logger.log("Scraping departments");
    const departments = await scrapDepartments();
    if (departments === undefined) {
      return;
    }

    await Promise.all(
      departments.map((department) =>
        Department.updateOrCreate(
          {
            id: extractLastStringInBrackets(department.name) ?? department.name,
          },
          { name: department.name, url: department.url },
        ),
      ),
    );
    this.logger.log("Scraping registrations");
    const registrations = await Promise.all(
      departments.map(async (department) => {
        const regs = await scrapRegistrations(department.url);
        if (regs === undefined) {
          return [];
        }
        department.registrations = regs;
        department.registrations.forEach(async (registration) => {
          await Registration.updateOrCreate(
            {
              id:
                extractLastStringInBrackets(registration.name) ??
                registration.name,
            },
            {
              name: registration.name,
              departmentId:
                extractLastStringInBrackets(department.name) ?? department.name,
            },
          );
        });
        return regs;
      }),
    ).then((results) => results.flat());
    this.logger.log("Registrations scraped");
    this.logger.log("Scraping courses urls");
    await Promise.all(
      registrations.map(async (registration) => {
        let urls;
        try {
          urls = await scrapCourses(registration.url);
        } catch (e: unknown) {
          // @ts-expect-error i dont caRe
          this.logger.logError(e);
        }
        if (urls === undefined) {
          return [];
        }
        registration.courses = urls.map((courseUrl) => {
          return { url: courseUrl, courseCode: "", groups: [], name: "" };
        });
      }),
    );
    this.logger.log("Courses urls scraped");
    this.logger.log("Scraping courses details");
    for (const registration of registrations) {
      await Promise.all(
        registration.courses.map(async (course) => {
          const courseCodeNameGroupsUrls = await scrapCourseNameGroupsUrls(
            course.url,
          );
          if (courseCodeNameGroupsUrls === undefined) {
            return;
          }
          const urls = courseCodeNameGroupsUrls.urls;
          course.courseCode = courseCodeNameGroupsUrls.courseCode;
          course.name = courseCodeNameGroupsUrls.courseName;
          course.groups = urls.map((url) => {
            return { url, groups: [] };
          });
          await Course.updateOrCreate(
            { id: courseCodeNameGroupsUrls.courseCode },
            {
              name: course.name,
              registrationId:
                extractLastStringInBrackets(registration.name) ??
                registration.name,
            },
          );
        }),
      );
    }
    console.log('Courses details scraped')
    console.log('Synchronizing group_archive with current groups')
    const currentGroups = await Group.all()
    await Promise.all(
      currentGroups.map(async (group) => {
        await GroupArchive.updateOrCreate(
          { id: group.id },
          {
            ...group.$attributes,
          }
        )
      })
    )
    console.log('Scraping groups details')
    for (const registration of registrations) {
      for (const course of registration.courses) {
        const detailsUrls = (await Promise.all(
          course.groups.map(async (group) => {
            return await scrapGroupsUrls(group.url);
          }),
        ).then((results) => results.flat())) as string[];

        await Promise.all(
          detailsUrls.map(async (url) => {
            const details = await scrapGroupDetails(url);
            if (details === undefined) {
              return;
            }
            await Group.updateOrCreate(
              {
                name: details.name.slice(0, 255),
                startTime: details.startTime.slice(0, 255),
                endTime: details.endTime.slice(0, 255),
                group: details.group.slice(0, 255),
                lecturer: details.lecturer
                  .trim()
                  .replace(/\s+/g, " ")
                  .slice(0, 255),
                week: details.week,
                day: details.day.slice(0, 255),
                type: details.type.slice(0, 255),
                courseId: course.courseCode.slice(0, 255),
              },
              {
                name: details.name.slice(0, 255),
                startTime: details.startTime.slice(0, 255),
                endTime: details.endTime.slice(0, 255),
                group: details.group.slice(0, 255),
                lecturer: details.lecturer
                  .trim()
                  .replace(/\s+/g, " ")
                  .slice(0, 255),
                week: details.week,
                day: details.day.slice(0, 255),
                type: details.type.slice(0, 255),
                courseId: course.courseCode.slice(0, 255),
                spotsOccupied: details.spotsOccupied,
                spotsTotal: details.spotsTotal,
                url: url.slice(0, 255),
              },
            );
          }),
        );
      }
    }
    this.logger.log("Groups details scraped");
  }
}
