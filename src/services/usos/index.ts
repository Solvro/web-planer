import * as cheerio from "cheerio";
import makeFetchCookie from "fetch-cookie";
import { LRUCache } from "lru-cache";

import type { GetCoursesCart } from "./getCoursesCart";
import type { GetCoursesEditions } from "./getCoursesEditions";
import type { GetProfile } from "./getProfile";
import type { GetRegistrationRoundCourses } from "./getRegistrationRoundCourses";
import type { GetRegistrations } from "./getRegistrations";
import { type GetTerms } from "./getTerms";
import type { GetUserRegistrations } from "./getUserRegistrations";
import { Day, Frequency, LessonType } from "./types";
import type { UsosClient } from "./usosClient";

const fetchWithCookie = makeFetchCookie(fetch);

const hourToTime = (hour: string) => {
  const [hours, minutes] = hour.split(":").map(Number);
  return {
    hours,
    minutes,
  };
};

interface Time {
  hours: number;
  minutes: number;
}

const calculateDifference = (start: Time, end: Time) => {
  let hours = end.hours - start.hours;
  let minutes = end.minutes - start.minutes;

  if (minutes < 0) {
    hours--;
    minutes += 60;
  }

  return {
    hours,
    minutes,
  };
};

const cache = new LRUCache<string, object>({
  ttl: 60 * 1000,
  ttlAutopurge: true,
});

export const usosService = (usosClient: UsosClient) => {
  return {
    getProfile: async () => {
      return usosClient.get<GetProfile>(
        "users/user?fields=id|student_number|first_name|last_name|sex|student_status|staff_status|email|photo_urls|homepage_url",
      );
    },
    getCoursesCarts: async () => {
      const data = await usosClient.get<GetCoursesCart>(
        "registrations/courses_cart",
      );

      return data;
    },

    getUserRegistrations: async () => {
      const data = await usosClient.get<GetUserRegistrations>(
        "registrations/user_registrations?fields=id|description|message|type|status|is_linkage_required|www_instance|faculty|rounds|related_courses&active=false",
      );

      return data;
    },
    getRegistrationRoundCourses: async (roundId: string) => {
      const data = await usosClient.get<GetRegistrationRoundCourses>(
        `registrations/registration_round_courses?registration_round_id=${roundId}`,
      );

      return data;
    },
    getCourseEditions: async (courseId: string, termId: string) => {
      const data = await usosClient.get<GetCoursesEditions>(
        `courses/course_edition2?course_id=${courseId}&term_id=${termId}&fields=course_units`,
      );

      return data;
    },
    getCourseUnitWithGroups: async (courseUnitId: string) => {
      const data = await usosClient.get(
        `courses/course_unit?course_unit_id=${courseUnitId}&fields=class_groups[participants[id]|course_unit_id|course_unit|lecturers|description]`,
      );

      return data;
    },
    getUserCourses: async () => {
      const data = await usosClient.get("courses/user");

      return data;
    },
    getRegistrations: async (facultyId: string) => {
      return usosClient.get<GetRegistrations>(
        `registrations/faculty_registrations?faculty_id=${facultyId}&fields=id|description|message|type|status|is_linkage_required|www_instance|related_courses`,
      );
    },
    getCourses: async (coursesIds: string[]) => {
      return usosClient.get(
        `courses/courses&course_ids=${coursesIds.join("|")}`,
      );
    },
    getClassGroupTimetable: async (
      courseUnitId: string,
      groupNumber: string,
    ) => {
      const data = await usosClient.get(
        `tt/classgroup?unit_id=${courseUnitId}&group_number=${groupNumber}&fields=type|start_time|end_time|frequency|group_number|classtype_name|course_name|sm_id`,
      );

      return data;
    },
    getMeetingDate: async (meetingId: string) => {
      const data = await usosClient.get(
        `meetings/meeting?meeting_id=${meetingId}`,
      );

      return data;
    },
    getTerms: async () => {
      const data = await usosClient.get<GetTerms>("terms/terms_index");

      return data;
    },
    getCourse: async (courseId: string) => {
      const cacheKey = `course-${courseId}`;

      if (cache.has(cacheKey)) {
        return cache.get(cacheKey) as Promise<{
          id: string;
          name: string;
        }>;
      }

      const data = await fetchWithCookie(
        `https://web.usos.pwr.edu.pl/kontroler.php?_action=katalog2/przedmioty/pokazPrzedmiot&prz_kod=${courseId}`,
        {
          signal: AbortSignal.timeout(5000),
        },
      );

      const $ = cheerio.load(await data.text());

      const name = $("h1").text();

      cache.set(cacheKey, {
        id: courseId,
        name,
      });

      return cache.get(cacheKey) as Promise<{
        id: string;
        name: string;
      }>;
    },

    getGroups: async (courseId: string, term?: string) => {
      const cacheKey = `groups-${courseId}-${term}`;

      if (cache.has(cacheKey)) {
        return cache.get(cacheKey) as Promise<
          Array<{
            hourStartTime: Time;
            hourEndTime: Time;
            duration: Time;
            person: string;
            personLink: string;
            groupLink: string;
            day: Day;
            courseId: string;
            type: LessonType;
            nameExtended: string;
            groupNumber: number;
            frequency: Frequency;
            name: string;
          }>
        >;
      }

      const data = await fetchWithCookie(
        `https://web.usos.pwr.edu.pl/kontroler.php?_action=katalog2/przedmioty/pokazPlanZajecPrzedmiotu&prz_kod=${courseId}&plan_division=semester&plan_format=new-ui${
          typeof term === "string" ? `&cdyd_kod=${term}` : ""
        }`,
        {
          headers: {
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          },
        },
      ).then((t) => t.text());

      const $ = cheerio.load(data);

      const entries = $("timetable-entry").toArray();

      const groups = entries.map((entry) => {
        const howOften = $(entry)
          .find('span[slot="dialog-event"]')
          .text()
          .split(",")
          .map((t) => t.trim());
        const frequencyText =
          howOften.find((t) => t.includes("co") || t.includes("każd")) ?? "";

        const frequency = (() => {
          switch (true) {
            case frequencyText.includes(Frequency.EVERY):
              return Frequency.EVERY;
            case frequencyText.includes(Frequency.ODD):
              return Frequency.ODD;
            case frequencyText.includes(Frequency.EVEN):
              return Frequency.EVEN;
            default:
              return Frequency.NEVER;
          }
        })();

        const day = (() => {
          switch (true) {
            case frequencyText.includes(Day.MONDAY):
              return Day.MONDAY;
            case frequencyText.includes(Day.TUESDAY):
              return Day.TUESDAY;
            case frequencyText.includes(Day.WEDNESDAY):
              return Day.WEDNESDAY;
            case frequencyText.includes(Day.THURSDAY):
              return Day.THURSDAY;
            case frequencyText.includes(Day.FRIDAY):
              return Day.FRIDAY;
            case frequencyText.includes(Day.SATURDAY):
              return Day.SATURDAY;
            case frequencyText.includes(Day.SUNDAY):
              return Day.SUNDAY;
            default:
              return Day.NEVER;
          }
        })();
        const person = $(entry)
          .find('div[slot="dialog-person"] > a')
          .text()
          .trim();
        const hours = howOften
          .find((t) => t.includes("-"))
          ?.split("-")
          .map((t) => t.trim());
        const hourStart = hours?.at(0) ?? "";
        const hourEnd = hours?.at(1) ?? "";
        const name = entry.attribs.name;
        const nameExtended = $(entry)
          .find('span[slot="dialog-info"]')
          .text()
          .trim();
        const personLink =
          $(entry).find('div[slot="dialog-person"] > a').attr("href") ?? "";
        const groupLink =
          $(entry).find('span[slot="dialog-info"] > a').attr("href") ?? "";
        const hourStartTime = hourToTime(hourStart);
        const hourEndTime = hourToTime(hourEnd);

        const type = (() => {
          switch (true) {
            case name.startsWith("C"):
              return LessonType.EXERCISES;
            case name.startsWith("L"):
              return LessonType.LABORATORY;
            case name.startsWith("P"):
              return LessonType.PROJECT;
            case name.startsWith("S"):
              return LessonType.SEMINAR;
            case name.startsWith("W"):
              return LessonType.LECTURE;
            default:
              return LessonType.LECTURE;
          }
        })();
        return {
          hourStartTime,
          hourEndTime,
          duration: calculateDifference(hourStartTime, hourEndTime),
          person,
          personLink,
          groupLink,
          day,
          courseId,
          type,
          nameExtended,
          groupNumber: Number(nameExtended.split(", ").at(1)?.split(" ").at(1)),
          frequency,
          name,
        };
      });

      cache.set(cacheKey, groups);

      return groups;
    },
  };
};
