import type { CheerioAPI } from "cheerio";
import * as cheerio from "cheerio";

import { Day } from "@/types";
import type { ClassType, WeekParity } from "@/types";

import { CatalogCourseNotFoundError } from "./usos-catalog-error";

type UsosSelection = ReturnType<CheerioAPI>;

const USOS_WEB_URL = process.env.USOS_WEB_URL ?? "https://web.usos.pwr.edu.pl";

const CLASS_TYPES = new Set<ClassType>(["C", "D", "L", "P", "S", "W"]);

const DAY_FROM_POLISH: { pattern: RegExp; day: Day }[] = [
  { pattern: /poniedzia[lł]ek/i, day: Day.MONDAY },
  { pattern: /wtorek/i, day: Day.TUESDAY },
  { pattern: /[sś]rod/i, day: Day.WEDNESDAY },
  { pattern: /czwartek/i, day: Day.THURSDAY },
  { pattern: /pi[aą]tek/i, day: Day.FRIDAY },
  { pattern: /sobot/i, day: Day.SATURDAY },
  { pattern: /niedziel/i, day: Day.SUNDAY },
];

export interface CatalogCourseTerm {
  termId: string;
  name: string;
  status: string | null;
}

export interface CatalogCourseLookup {
  courseId: string;
  name: string;
  terms: CatalogCourseTerm[];
}

export interface CatalogScrapedGroup {
  unitId: string;
  groupNumber: string;
  classtypeId: ClassType;
  lecturer: string;
  day: Day;
  startTime: string;
  endTime: string;
  week: WeekParity;
  dates: string[];
}

export interface CatalogCourseTimetable {
  courseId: string;
  courseName: string;
  termId: string;
  termName: string;
  groups: CatalogScrapedGroup[];
}

export function usosWebUrl(
  action: string,
  parameters: Record<string, string>,
): string {
  const url = new URL(`${USOS_WEB_URL}/kontroler.php`);
  url.searchParams.set("_action", action);
  for (const [key, value] of Object.entries(parameters)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export function coursePageUrl(courseId: string): string {
  return usosWebUrl("katalog2/przedmioty/pokazPrzedmiot", {
    prz_kod: courseId,
  });
}

export function courseTimetableUrl(courseId: string, termId: string): string {
  return usosWebUrl("katalog2/przedmioty/pokazPlanZajecPrzedmiotu", {
    prz_kod: courseId,
    cdyd_kod: termId,
    plan_division: "semester",
  });
}

/** Accepts a raw code or a USOSweb course URL and returns the course code. */
export function normalizeCourseCode(input: string): string {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get("prz_kod");
    if (fromQuery !== null && fromQuery.trim() !== "") {
      return fromQuery.trim();
    }
  } catch {
    // Not a URL — treat the whole string as a course code.
  }
  return trimmed;
}

export async function fetchUsosWebHtml(url: string): Promise<{
  status: number;
  html: string;
}> {
  const response = await fetch(url, {
    headers: { Accept: "text/html" },
    redirect: "follow",
  });
  return { status: response.status, html: await response.text() };
}

export function parseCourseLookup(
  html: string,
  requestedCode: string,
): CatalogCourseLookup {
  const $ = cheerio.load(html);
  const name = $("h1").first().text().replaceAll(/\s+/g, " ").trim();
  if (name === "" || /niepoprawne żądanie/i.test(name)) {
    throw new CatalogCourseNotFoundError(requestedCode);
  }

  const courseId = extractTextAfterLabel($, "Kod przedmiotu:") ?? requestedCode;

  const terms: CatalogCourseTerm[] = [];
  const seen = new Set<string>();

  $("usos-frame.zajecia").each((_, frame) => {
    const $frame = $(frame);
    const heading = $frame
      .find("h2")
      .first()
      .text()
      .replaceAll(/\s+/g, " ")
      .trim();
    const headingMatch = /Zajęcia w cyklu\s+"([^"]+)"(?:\s+\(([^)]+)\))?/u.exec(
      heading,
    );
    if (headingMatch === null) {
      return;
    }

    const termId = extractTermIdFromFrame($, $frame);
    if (termId === null || seen.has(termId)) {
      return;
    }
    seen.add(termId);
    const statusCapture = headingMatch.at(2);
    terms.push({
      termId,
      name: headingMatch[1].trim(),
      status:
        statusCapture === undefined || statusCapture.trim() === ""
          ? null
          : statusCapture.trim(),
    });
  });

  return { courseId, name, terms };
}

export function parseCourseTimetable(
  html: string,
  courseId: string,
  termId: string,
): CatalogCourseTimetable {
  const $ = cheerio.load(html);
  const heading = $("h1").first().text().replaceAll(/\s+/g, " ").trim();
  const courseName = courseNameFromTimetableHeading(heading);
  const termName =
    $("h1 .note").first().text().replaceAll(/\s+/g, " ").trim() || termId;

  const groups: CatalogScrapedGroup[] = [];
  const seen = new Set<string>();

  $("timetable-entry").each((_, entry) => {
    const group = parseTimetableEntry($(entry));
    if (group === null) {
      return;
    }
    const key = `${group.unitId}:${group.groupNumber}:${group.day}:${group.startTime}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    groups.push(group);
  });

  return {
    courseId,
    courseName,
    termId,
    termName,
    groups,
  };
}

function courseNameFromTimetableHeading(heading: string): string {
  const prefix = "Plan zajęć przedmiotu ";
  const end = heading.lastIndexOf("[");
  if (!heading.startsWith(prefix) || end <= prefix.length) {
    return heading;
  }
  return heading.slice(prefix.length, end).trim();
}

function extractTextAfterLabel($: CheerioAPI, label: string): string | null {
  const row = $("#layout-main-content")
    .find("table")
    .find("tr")
    .filter((_, element) => $(element).text().includes(label))
    .first();
  if (row.length === 0) {
    return null;
  }
  const value = row.find("td").eq(1).text().replaceAll(/\s+/g, " ").trim();
  return value === "" ? null : value;
}

function extractTermIdFromFrame(
  $: CheerioAPI,
  $frame: UsosSelection,
): string | null {
  const hrefs = $frame
    .find("a[href]")
    .toArray()
    .map((anchor) => $(anchor).attr("href") ?? "");

  for (const href of hrefs) {
    const termId = termIdFromHref(href);
    if (termId !== null) {
      return termId;
    }
  }

  const scheduleName = $frame
    .find("[data-schedule-name]")
    .first()
    .attr("data-schedule-name");
  if (scheduleName?.startsWith("plan_") === true) {
    return scheduleName.slice("plan_".length);
  }

  return null;
}

function termIdFromHref(href: string): string | null {
  try {
    const url = new URL(href, USOS_WEB_URL);
    const value = url.searchParams.get("cdyd_kod");
    return value === null || value.trim() === "" ? null : value;
  } catch {
    return null;
  }
}

function parseTimetableEntry(
  $entry: UsosSelection,
): CatalogScrapedGroup | null {
  const dialogInfoHref =
    $entry.find("[slot='dialog-info'] a").attr("href") ?? "";
  const unitAndGroup = unitAndGroupFromHref(dialogInfoHref);
  const name = ($entry.attr("name") ?? "").replaceAll("\u00A0", " ");
  const fromName = parseGroupName(name);
  const dialogInfo = $entry
    .find("[slot='dialog-info']")
    .text()
    .replaceAll(/\s+/g, " ")
    .trim();
  const fromDialog = parseDialogInfo(dialogInfo);
  const groupNumber =
    unitAndGroup?.groupNumber ??
    fromName?.groupNumber ??
    fromDialog?.groupNumber;
  const classtypeId = fromName?.classtypeId ?? fromDialog?.classtypeId ?? null;

  if (
    unitAndGroup === null ||
    groupNumber === undefined ||
    classtypeId === null
  ) {
    return null;
  }

  const eventText = $entry
    .find("[slot='dialog-event']")
    .text()
    .replaceAll(/\s+/g, " ")
    .trim();
  const event = parseDialogEvent(eventText);
  const gridTimes = parseGridTimes($entry.attr("style") ?? "");
  const slotTime = $entry.find("[slot='time']").text().trim();
  const startTime =
    event?.startTime ??
    (slotTime === "" ? undefined : slotTime) ??
    gridTimes?.startTime;
  const endTime = event?.endTime ?? gridTimes?.endTime;
  const day = event?.day ?? null;

  if (day === null || startTime === undefined || endTime === undefined) {
    return null;
  }

  const lecturerFromPerson = $entry
    .find("[slot='dialog-person']")
    .text()
    .replaceAll(/\s+/g, " ")
    .trim();
  const lecturer =
    (lecturerFromPerson.endsWith(",")
      ? lecturerFromPerson.slice(0, -1).trim()
      : lecturerFromPerson) ||
    $entry.find("[slot='info']").text().replaceAll(/\s+/g, " ").trim();

  return {
    unitId: unitAndGroup.unitId,
    groupNumber,
    classtypeId,
    lecturer,
    day,
    startTime: normalizeClock(startTime),
    endTime: normalizeClock(endTime),
    week: event?.week ?? "",
    dates: [],
  };
}

function unitAndGroupFromHref(
  href: string,
): { unitId: string; groupNumber: string } | null {
  try {
    const url = new URL(href, USOS_WEB_URL);
    const unitId = url.searchParams.get("zaj_cyk_id");
    const groupNumber = url.searchParams.get("gr_nr");
    if (unitId === null || unitId.trim() === "" || groupNumber === null) {
      return null;
    }
    return { unitId, groupNumber };
  } catch {
    return null;
  }
}

function parseGroupName(
  name: string,
): { classtypeId: ClassType; groupNumber: string } | null {
  const match = /^([A-Za-z])\s*,\s*gr\.\s*(\d+)/u.exec(name.trim());
  if (match === null) {
    return null;
  }
  return {
    classtypeId: asClassType(match[1]),
    groupNumber: match[2],
  };
}

function parseDialogInfo(
  text: string,
): { classtypeId: ClassType; groupNumber: string } | null {
  const match = /grupa\s+(\d+)/i.exec(text);
  if (match === null) {
    return null;
  }
  const typeMatch =
    /^(Wykład|Projekt|Ćwiczenia|Laboratorium|Seminarium|Dyplomowe)/u.exec(text);
  const typeFromLabel: Record<string, ClassType> = {
    Wykład: "W",
    Projekt: "P",
    Ćwiczenia: "C",
    Laboratorium: "L",
    Seminarium: "S",
    Dyplomowe: "D",
  };
  return {
    classtypeId:
      typeMatch === null ? "C" : (typeFromLabel[typeMatch[1]] ?? "C"),
    groupNumber: match[1],
  };
}

function parseDialogEvent(text: string): {
  day: Day;
  startTime: string;
  endTime: string;
  week: WeekParity;
} | null {
  const timeMatch = /(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/.exec(text);
  if (timeMatch === null) {
    return null;
  }
  const day = DAY_FROM_POLISH.find(({ pattern }) => pattern.test(text))?.day;
  if (day === undefined) {
    return null;
  }
  let week: WeekParity = "";
  if (text.includes("nieparzyste")) {
    week = "TN";
  } else if (text.includes("parzyste")) {
    week = "TP";
  }
  return {
    day,
    startTime: timeMatch[1],
    endTime: timeMatch[2],
    week,
  };
}

function parseGridTimes(
  style: string,
): { startTime: string; endTime: string } | null {
  const start = /grid-row-start:\s*g(\d+)/.exec(style);
  const end = /grid-row-end:\s*g(\d+)/.exec(style);
  if (start === null || end === null) {
    return null;
  }
  return {
    startTime: gridTokenToClock(start[1]),
    endTime: gridTokenToClock(end[1]),
  };
}

function gridTokenToClock(token: string): string {
  const padded = token.padStart(4, "0");
  return `${padded.slice(0, -2)}:${padded.slice(-2)}`;
}

function normalizeClock(value: string): string {
  const match = /(\d{1,2}):(\d{2})/.exec(value);
  if (match === null) {
    return value;
  }
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function asClassType(value: string): ClassType {
  const letter = value.trim().charAt(0).toUpperCase();
  return CLASS_TYPES.has(letter as ClassType) ? (letter as ClassType) : "C";
}
