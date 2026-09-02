import type { ExtendedGroup } from "@/types";

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

/** "YYYY-MM-DD" + "HH:MM" → "YYYYMMDDTHHMM00" (floating local time, qualified with TZID). */
const toLocalStamp = (date: string, time: string) => {
  const [hours = "00", minutes = "00"] = time.split(":");
  return `${date.replaceAll("-", "")}T${hours.padStart(2, "0")}${minutes.padStart(2, "0")}00`;
};

const toUtcStamp = (date: Date) =>
  date
    .toISOString()
    .replaceAll(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

function buildEvent(
  group: ExtendedGroup,
  date: string,
  stamp: string,
): string[] {
  return [
    "BEGIN:VEVENT",
    `UID:${group.groupOnlineId}-${date}@planer.solvro.pl`,
    `DTSTAMP:${stamp}`,
    `SUMMARY:${escapeText(`${group.courseName} (${group.courseType})`)}`,
    `DESCRIPTION:${escapeText(`Grupa ${group.groupNumber}${group.lecturer === "" ? "" : ` · ${group.lecturer}`}`)}`,
    `DTSTART;TZID=${TIMEZONE}:${toLocalStamp(date, group.startTime)}`,
    `DTEND;TZID=${TIMEZONE}:${toLocalStamp(date, group.endTime)}`,
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

/**
 * Builds a calendar with one event per real meeting date of every selected
 * group. Dates come straight from USOS, so holidays and rescheduled weeks are
 * already accounted for.
 */
function buildIcs(groups: ExtendedGroup[]): IcsExport {
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
    if (!group.isChecked) {
      continue;
    }
    const dates = group.dates ?? [];
    if (dates.length === 0) {
      skippedGroups++;
      continue;
    }
    exportedGroups++;
    for (const date of dates) {
      lines.push(...buildEvent(group, date, stamp));
    }
  }

  lines.push("END:VCALENDAR");
  return { content: lines.join(CRLF) + CRLF, exportedGroups, skippedGroups };
}

export function downloadIcs(groups: ExtendedGroup[], name: string): IcsExport {
  const result = buildIcs(groups);
  if (result.exportedGroups === 0) {
    return result;
  }

  const blob = new Blob([result.content], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name || "plan"}.ics`;
  link.click();
  URL.revokeObjectURL(url);

  return result;
}
