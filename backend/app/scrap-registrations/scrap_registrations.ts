import * as cheerio from "cheerio";

import logger from "@adonisjs/core/services/logger";

export interface ScrapedGroupSummary {
  name: string;
  type: string;
  group: string;
  week: string;
  day: string;
  startTime: string;
  endTime: string;
  lecturer: string;
}
export interface ScrapedGroup {
  url: string;
  groups: ScrapedGroupSummary[];
}

export interface ScrapedCourse {
  name: string;
  courseCode: string;
  url: string;
  groups: ScrapedGroup[];
}
export interface ScrapedRegistration {
  name: string;
  url: string;
  courses: ScrapedCourse[];
}

export interface ScrapedDepartment {
  name: string;
  url: string;
  registrations: ScrapedRegistration[];
}

const DEPARTMENTS_URL =
  "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/index";

async function fetchData(url: string, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
}

export async function scrapDepartments(): Promise<ScrapedDepartment[]> {
  const departments: ScrapedDepartment[] = [];
  const response = await fetchData(DEPARTMENTS_URL);
  if (!response.ok) {
    throw new Error(
      `Got response code ${response.status} ${response.statusText} while fetching departments`,
    );
  }
  const body = await response.text();
  const $ = cheerio.load(body);

  const departmentsBlock = $("div#layout-c22")
    .find(".autostrong")
    .children("tr");
  departmentsBlock.each((_, element) => {
    const newDepartment: ScrapedDepartment = {
      name: "",
      url: "",
      registrations: [],
    };
    const name = $(element).find("td").html()?.trim();
    if (name !== undefined) {
      newDepartment.name = name;
    }
    const url = $(element).find("a").attr("href");
    if (url !== undefined) {
      newDepartment.url = url;
    }
    departments.push(newDepartment);
  });
  return departments;
}

export async function scrapRegistrations(
  departmentUrl: string,
): Promise<ScrapedRegistration[]> {
  const registrationsNames: string[] = [];
  const registrationsUrls: string[] = [];
  const response = await fetchData(departmentUrl);
  if (!response.ok) {
    throw new Error(
      `Got reponse code ${response.status} ${response.statusText} while fetching registrations`,
    );
  }
  const body = await response.text();
  const $ = cheerio.load(body);

  const registrationsBlock = $("main#layout-main-content")
    .find("#layout-c22")
    .find("div.usos-ui");
  const h2 = registrationsBlock.children("h2");
  const names = registrationsBlock.children("usos-link");
  h2.each((_, element) => {
    registrationsNames.push($(element).text().trim());
  });
  names.each((_, element) => {
    const url = $(element).find("a").attr("href");
    if (url !== undefined) {
      registrationsUrls.push(url);
    }
  });
  return registrationsNames.map((name, index) => {
    return {
      name,
      url: registrationsUrls[index],
      courses: [],
    };
  });
}

export async function scrapCourses(registrationUrl: string): Promise<string[]> {
  const coursesUrls: string[] = [];
  let nextUrl: string | undefined = registrationUrl;
  while (nextUrl !== undefined) {
    const response = await fetchData(nextUrl);
    if (!response.ok) {
      throw new Error(
        `Got response code ${response.status} ${response.statusText} while fetching courses`,
      );
    }

    const body = await response.text();
    const $ = cheerio.load(body);

    const courses = $("main#layout-main-content")
      .find("table")
      .find("tbody")
      .children("tr");

    courses.each((_, element) => {
      const courseUrl = $(element).find("usos-link").find("a").attr("href");
      if (courseUrl !== undefined) {
        coursesUrls.push(courseUrl);
      }
    });

    nextUrl = $("table-nav-bar").attr("next-page-url");
  }
  return coursesUrls;
}

export interface ScrapedCourseDetails {
  courseName: string;
  courseCode: string;
  urls: string[];
}

export async function scrapCourseNameGroupsUrls(
  courseUrl: string,
): Promise<ScrapedCourseDetails> {
  let courseName = "";
  let courseCode = "";

  const urls = new Set<string>();

  const response = await fetchData(courseUrl);
  if (!response.ok) {
    throw new Error(
      `Got response code ${response.status} ${response.statusText} while fetching course details`,
    );
  }

  const body = await response.text();
  const $ = cheerio.load(body);

  courseName = $("main-panel#main").find("h1").text().trim();

  courseCode = $("div#layout-c22")
    .find("div.usos-ui")
    .find("usos-frame")
    .find("table tbody tr")
    .eq(0)
    .find("td")
    .eq(1)
    .text()
    .trim();

  const groups = $("div#layout-c22")
    .find("div.usos-ui")
    .children("usos-frame")
    .toArray();

  for (const element of groups) {
    const title = $(element).find("h2").text();

    if (
      title.includes("(jeszcze nie rozpoczęty)") ||
      title.includes("(w trakcie)")
    ) {
      const linkToPlanRaw = $(element)
        .find('a[href*="pokazPlanZajecPrzedmiotu"]')
        .first()
        .attr("href");

      if (!linkToPlanRaw) {
        continue;
      }

      const linkToPlan = linkToPlanRaw.replace(/&amp;/g, "&");

      const planUrls = await scrapGroupsFromPlan(linkToPlan);
      for (const u of planUrls) {
        urls.add(u);
      }
    }
  }

  return { courseName, urls: [...urls], courseCode };
}

export async function scrapGroupsFromPlan(planUrl: string): Promise<string[]> {
  const response = await fetchData(planUrl);
  if (!response.ok) {
    throw new Error(
      `Got response code ${response.status} ${response.statusText} while fetching plan details`,
    );
  }

  const body = await response.text();
  const $ = cheerio.load(body);

  const urls = new Set<string>();

  $("div#layout-c22")
    .find("div.usos-ui")
    .find("div.timetable-wrapper")
    .find("usos-timetable")
    .find("timetable-day")
    .find("timetable-entry")
    .find('span[slot="dialog-info"] a[href*="pokazZajecia"]')
    .each((_, a) => {
      const hrefRaw = $(a).attr("href");
      if (!hrefRaw) {
        return;
      }
      urls.add(hrefRaw);
    });

  return [...urls];
}

export interface ScrapedGroupMeeting {
  startTime: string;
  endTime: string;
  week: "TP" | "TN" | "-" | "!";
  day: string;
}

export interface ScrapedGroupDetails {
  name: string;
  type: string;
  group: string;
  meetings: ScrapedGroupMeeting[];
  lecturer: string;
  spotsOccupied: number;
  spotsTotal: number;
}

export async function scrapGroupDetails(
  groupUrl: string,
): Promise<ScrapedGroupDetails> {
  const response = await fetchData(groupUrl);
  if (!response.ok) {
    throw new Error(
      `Got response code ${response.status} ${response.statusText} while fetching group details`,
    );
  }

  const body = await response.text();
  const $ = cheerio.load(body);

  const mainContent = $("div#layout-c22");

  const name = mainContent.find("h1").find("a").text().trim();
  const type = giveGroupType(mainContent.find("h1").text().trim());
  const group = getGroupNumber(mainContent.find("h1").text());

  const meetings: ScrapedGroupMeeting[] = [];
  const meetingsDedup = new Set<string>();

  mainContent
    .find("table")
    .find("tbody")
    .find("tr")
    .eq(2)
    .find("td")
    .eq(1)
    .children("div")
    .each((_, element) => {
      const query = $(element).children();
      if (
        query.length === 1 &&
        query.get(0)?.name === "span" &&
        query.attr("class") === "note"
      ) {
        // useless usos note, can skip
        return;
      }

      try {
        const meeting = parseMeeting($(element).text().trim());
        const meetingJson = JSON.stringify(meeting);
        if (meetingsDedup.has(meetingJson)) {
          logger.info(
            `Duplicate meeting spec detected for course '${name}' (${type}), group ${group}: ${meetingJson}`,
          );
          return;
        }
        meetingsDedup.add(meetingJson);
        meetings.push(meeting);
      } catch (e) {
        logger.warn(
          `Failed to parse meeting data for course '${name}' (${type}), group ${group}: ${e}`,
        );
      }
    });
  const lecturer = mainContent
    .find("table")
    .find("tbody")
    .children()
    .filter(function () {
      return $(this).text().includes("Prowadzący:");
    })
    .find("td")
    .eq(1)
    .text()
    .trim();
  const spotsOccupied = mainContent
    .find("table")
    .find("tbody")
    .children()
    .filter(function () {
      return $(this).text().includes("Liczba osób w grupie:");
    })
    .find("td")
    .eq(1)
    .text()
    .trim();
  const spotsTotal = mainContent
    .find("table")
    .find("tbody")
    .children()
    .filter(function () {
      return $(this).text().includes("Limit miejsc:");
    })
    .find("td")
    .eq(1)
    .text()
    .trim();
  const spotsOccupiedNumber = Number.parseInt(spotsOccupied, 10);
  const spotsTotalNumber = Number.parseInt(spotsTotal, 10);
  return {
    name,
    type,
    group,
    meetings,
    lecturer,
    spotsOccupied: Number.isNaN(spotsOccupiedNumber) ? 0 : spotsOccupiedNumber,
    spotsTotal: Number.isNaN(spotsTotalNumber) ? 0 : spotsTotalNumber,
  };
}

function parseMeeting(meetingString: string): ScrapedGroupMeeting {
  if (meetingString.includes("brak danych")) {
    throw new Error("No data!");
  }
  const regex = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/;
  const match = regex.exec(meetingString);

  if (match === null) {
    throw new Error("Failed to parse time range!");
  }
  return {
    startTime: match[1],
    endTime: match[2],
    day: parseDay(meetingString),
    week: checkWeek(meetingString),
  };
}

const giveGroupType = (groupType: string) => {
  if (groupType.includes("Ćwiczenia")) {
    return "C";
  } else if (groupType.includes("Zajęcia")) {
    return "L";
  } else if (groupType.includes("Wykład")) {
    return "W";
  } else if (groupType.includes("Projekt")) {
    return "P";
  } else if (groupType.includes("Seminarium")) {
    return "S";
  }
  return "Unknown";
};

const getGroupNumber = (groupInfo: string) => {
  const regex = /grupa nr (\d+)/;
  const match = regex.exec(groupInfo);
  return match !== null ? match[1] : "1";
};

const checkWeek = (week: string): "TN" | "TP" | "-" | "!" => {
  if (week.includes("(nieparzyste),")) {
    return "TN";
  }
  if (week.includes("(parzyste),")) {
    return "TP";
  }
  if (
    week.includes("jednokrotnie,") ||
    week.includes("(niestandardowa częstotliwość),")
  ) {
    return "!";
  }
  if (week.includes("każd")) {
    return "-";
  }
  throw new Error("Failed to extract meeting frequency");
};

function parseDay(day: string): string {
  if (day.includes("poniedziałek")) {
    return "poniedziałek";
  } else if (day.includes("wtorek")) {
    return "wtorek";
  } else if (day.includes("środa")) {
    return "środa";
  } else if (day.includes("czwartek")) {
    return "czwartek";
  } else if (day.includes("piątek")) {
    return "piątek";
  } else if (day.includes("sobota")) {
    return "sobota";
  } else if (day.includes("niedziela")) {
    return "niedziela";
  }
  throw new Error("Failed to extract meeting day");
}
