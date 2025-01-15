import * as cheerio from "cheerio";
import iconv from "iconv-lite";

import logger from "@adonisjs/core/services/logger";

import env from "#start/env";

interface Lecturer {
  rating: string;
  name: string;
  lastName: string;
  opinions: string;
  visits: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CATEGORIES_STARTS_URLS = [
  "https://polwro.com/viewforum.php?f=6&topicdays=0&start=0",
  "https://polwro.com/viewforum.php?f=7&topicdays=0&start=0",
  "https://polwro.com/viewforum.php?f=25&topicdays=0&start=0",
  "https://polwro.com/viewforum.php?f=8&topicdays=0&start=0",
  "https://polwro.com/viewforum.php?f=9&topicdays=0&start=0",
  "https://polwro.com/viewforum.php?f=10&topicdays=0&start=0",
  "https://polwro.com/viewforum.php?f=11&topicdays=0&start=0",
  "https://polwro.com/viewforum.php?f=12&topicdays=0&start=0",
  "https://polwro.com/viewforum.php?f=42&topicdays=0&start=0",
];

async function fetchLecturers(url: string, timeout = 100000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9,pl-PL;q=0.8,pl;q=0.7",
        Cookie: env.get("POLWRO_COOKIES") ?? "",
      },

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

function removeTitles(data: string[]): string[] {
  const titlesToRemove = [
    "mg",
    "mg.",
    "mgr",
    "mgr.",
    "inż",
    "inż.",
    "inz",
    "inz.",
    "dr",
    "dr.",
    "prof",
    "prof.",
    "hab",
    "hab.",
  ];
  return data.filter((word) => !titlesToRemove.includes(word.toLowerCase()));
}

const scrapLecturersPage = async (url: string) => {
  const response = await fetchLecturers(url);
  if (!response.ok) {
    logger.error("Something went wrong in fetching lecturers");
    return;
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const body = iconv.decode(buffer, "ISO-8859-2");

  if (body.includes("Zapomniałem hasła")) {
    logger.error("You need to login to polwro.com. Wrong cookies my friends");
    // TODO: set this in env
    await delay(1000);
    return;
  }

  const $ = cheerio.load(body);
  logger.info("Planer to bambiki");
  const lecturers = $("tbody")
    .find("td")
    .children("div.hrw")
    .children("div.img.folder, div.img.folder_hot, div.img.folder_locked")
    .map((_, element) => {
      logger.info("Planer to bambiki 1");
      const smallBlock = $(element);
      const text = smallBlock.text().trim().replace(/\s+/g, " ");
      const splitedData = removeTitles(text.split(" "));
      const rating = splitedData[0].replace(",", ".");
      const name = splitedData[2].replace(",", "");
      const lastName = splitedData[1].replace(",", "");
      const opinionsMatch = /Opinii: (\d+)/.exec(text);
      const visitsMatch = /Odwiedzin: (\d+)/.exec(text);

      const opinions = opinionsMatch !== null ? opinionsMatch[1] : "0";
      const visits = visitsMatch !== null ? visitsMatch[1] : "0";

      return { rating, name, lastName, opinions, visits };
    })
    .get();

  // TODO: refactor this to not use let
  let nextPageUrl = "";
  $("tbody")
    .find("ul.vfigntop")
    .find("li.rr")
    .find("div")
    .children("a")
    .each((_, element) => {
      if ($(element).text().includes("następna")) {
        nextPageUrl = `https://polwro.com/${$(element).attr("href")}`;
      }
    });

  // TODO: set this in env
  await delay(1000);
  return { lecturers, nextPageUrl };
};

const scrapLecturersForCategory = async (url: string) => {
  const lecturers: Lecturer[] = [];
  let nextPage = url;
  while (nextPage !== "") {
    const result = await scrapLecturersPage(nextPage);
    if (result === undefined) {
      return lecturers;
    }
    // TODO: instead of pushing this to array, either save it to db or yield it
    lecturers.push(...result.lecturers);
    nextPage = result.nextPageUrl;
  }
  return lecturers;
};

export const scrapLecturers = async () => {
  // TODO: do not save all shit to RAM, pls
  const lecturers: Lecturer[] = [];
  for (const url of CATEGORIES_STARTS_URLS) {
    logger.info(`scraping category ${url}`);
    const lecturersFromCategory = await scrapLecturersForCategory(url);
    lecturers.push(...lecturersFromCategory);
  }
  return lecturers;
};
// elo żelo
