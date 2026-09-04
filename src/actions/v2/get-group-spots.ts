"use server";

import * as cheerio from "cheerio";

import redis from "@/lib/redis";
import { getOrSetRedisSmart } from "@/lib/redis/get-set-smart";
import type { ScheduleParity } from "@/lib/utils/build-group-schedule-pattern";

export interface GroupSpotsDTO {
  spotsOccupied: number;
  spotsTotal: number;
  parity: ScheduleParity;
}

const USOS_WEB_URL = process.env.USOS_WEB_URL ?? "https://web.usos.pwr.edu.pl";

function buildGroupPageUrl(unitId: string, groupNumber: string): string {
  const url = new URL(`${USOS_WEB_URL}/kontroler.php`);
  url.searchParams.set("_action", "katalog2/przedmioty/pokazZajecia");
  url.searchParams.set("zaj_cyk_id", unitId);
  url.searchParams.set("gr_nr", groupNumber);
  return url.toString();
}

function findRow($: cheerio.CheerioAPI, label: string) {
  return $("div#layout-c22")
    .find("table")
    .find("tbody")
    .children()
    .filter(function () {
      return $(this).text().includes(label);
    })
    .find("td")
    .eq(1);
}

function extractRowValue($: cheerio.CheerioAPI, label: string): number {
  const text = findRow($, label).text().trim();

  const value = Number.parseInt(text, 10);
  return Number.isNaN(value) ? 0 : value;
}

/**
 * The "Termin i miejsce" row states the meeting frequency in Polish, e.g.
 * "co drugi piątek (nieparzyste)" (odd weeks) or "co dwa tygodnie
 * (parzyste)" (even weeks) or "co tydzień" (every week). We read this text
 * directly instead of inferring parity from the list of past meeting dates.
 */
function extractParity($: cheerio.CheerioAPI): ScheduleParity {
  const html = findRow($, "Termin i miejsce:");

  html.find(".note").remove();

  const text = html.text();

  if (text.includes("nieparzyste")) {
    return "odd";
  }
  if (text.includes("parzyste")) {
    return "even";
  }
  if (text.includes("co tydzień")) {
    return "all";
  }
  return "unknown";
}

async function scrapeGroupSpots(groupUrl: string): Promise<GroupSpotsDTO> {
  const response = await fetch(groupUrl);

  if (!response.ok) {
    throw new Error(
      `Got response code ${response.status.toString()} ${response.statusText} while fetching group page`,
    );
  }

  const body = await response.text();
  const $ = cheerio.load(body);

  return {
    spotsOccupied: extractRowValue($, "Liczba osób w grupie:"),
    spotsTotal: extractRowValue($, "Limit miejsc:"),
    parity: extractParity($),
  };
}

export async function getGroupSpotsAction(
  unitId: string,
  groupNumber: string,
): Promise<GroupSpotsDTO> {
  return getOrSetRedisSmart({
    redis,
    key: `usos:group_spots:v2:${unitId}:${groupNumber}`,
    minFreshSeconds: 60 * 5,
    maxStaleSeconds: 60 * 60 * 48,
    fetcher: async () =>
      scrapeGroupSpots(buildGroupPageUrl(unitId, groupNumber)),
  });
}
