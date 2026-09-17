import type { ClassgroupDateDTO } from "@/actions/v2/get-class-group-dates";

const CRLF = "\r\n";
const TIMEZONE = "Europe/Warsaw";

const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${TIMEZONE}`,
  `X-LIC-LOCATION:${TIMEZONE}`,
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

const BACKSLASH = String.fromCodePoint(92);

/** RFC 5545 text escaping. */
const escapeText = (value: string) =>
  value
    .replaceAll(BACKSLASH, BACKSLASH + BACKSLASH)
    .replaceAll(";", String.raw`\;`)
    .replaceAll(",", String.raw`\,`)
    .replaceAll(/\r?\n/g, String.raw`\n`);

/** "YYYY-MM-DD HH:MM:SS" (USOS meeting format) → "YYYYMMDDTHHMM00" (floating local time, qualified with TZID). */
function formatToIcsDate(dateString: string): string {
  const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
  const match = regex.exec(dateString);

  if (match == null) {
    throw new Error(
      'Nieprawidłowy format daty. Oczekiwano "yyyy-mm-dd hh:mm:ss"',
    );
  }

  const [, year, month, day, hour, minute, _second] = match;

  return `${year}${month}${day}T${hour}${minute}00`;
}

const toUtcStamp = (date: Date) =>
  date
    .toISOString()
    .replaceAll(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

function buildEvent(
  group: CalendarGroup,
  meeting: ClassgroupDateDTO,
  stamp: string,
): string[] {
  return [
    "BEGIN:VEVENT",
    `UID:${group.id}-${formatToIcsDate(meeting.startTime ?? "")}@planer.solvro.pl`,
    `DTSTAMP:${stamp}`,
    `SUMMARY:${escapeText(`${group.courseName} (${group.courseType})`)}`,
    `DESCRIPTION:${escapeText(`Grupa ${group.groupNumber}${group.lecturer === "" ? "" : ` · ${group.lecturer}`}`)}`,
    `DTSTART;TZID=${TIMEZONE}:${formatToIcsDate(meeting.startTime ?? "")}`,
    `DTEND;TZID=${TIMEZONE}:${formatToIcsDate(meeting.endTime ?? "")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
  ];
}

export interface IcsExport {
  content: string;
  /** Selected groups that were exported. */
  exportedGroups: number;
  /** Selected groups without meeting dates (saved before dates were stored). */
  skippedGroups: number;
}

export interface CalendarGroup {
  dates: string[];
  id: string;
  courseName: string;
  courseType: string;
  groupNumber: string;
  lecturer: string;
  startTime: string;
  endTime: string;
  meetings: ClassgroupDateDTO[];
}

export interface CalendarMeeting {
  dates: string[];
  startTime: string;
  endTime: string;
}

/**
 * Builds a calendar with one event per real meeting date of every selected
 * group. Dates come straight from USOS, so holidays and rescheduled weeks are
 * already accounted for.
 */
export function buildIcs(groups: CalendarGroup[]): IcsExport {
  const stamp = toUtcStamp(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Planer Solvro//NONSGML v2.0//EN",
    "CALSCALE:GREGORIAN",
    ...VTIMEZONE,
  ];

  let exportedGroups = 0;
  let skippedGroups = 0;

  for (const group of groups) {
    const meetings = group.meetings;
    if (meetings.length === 0) {
      skippedGroups++;
      continue;
    }
    exportedGroups++;
    for (const meeting of meetings) {
      lines.push(...buildEvent(group, meeting, stamp));
    }
  }

  lines.push("END:VCALENDAR");
  return { content: lines.join(CRLF) + CRLF, exportedGroups, skippedGroups };
}
