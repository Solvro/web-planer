import * as cheerio from "cheerio";
import iconv from "iconv-lite";

import logger from "@adonisjs/core/services/logger";

import Lecturer from "#models/lecturer";
import env from "#start/env";

import { loginToPolwro } from "./polwro_login.js";

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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchLecturers(
  url: string,
  authCookie: string,
  timeout = 100000,
) {
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
        Cookie: authCookie,
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

const scrapLecturersPage = async (url: string, authCookie: string) => {
  const response = await fetchLecturers(url, authCookie);
  if (!response.ok) {
    logger.error("Something went wrong in fetching lecturers");
    return;
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const body = iconv.decode(buffer, "ISO-8859-2");

  if (body.includes("Zapomniałem hasła")) {
    logger.error("You need to login to polwro.com. Wrong cookies my friends");
    await delay(Number(env.get("POLWRO_DELAY")));
    return;
  }

  const $ = cheerio.load(body);
  const lecturers = $("tbody")
    .find("td")
    .children("div.hrw")
    .children("div.img.folder, div.img.folder_hot, div.img.folder_locked")
    .map((_, element) => {
      const smallBlock = $(element);
      const text = smallBlock.text().trim().replace(/\s+/g, " ");
      const splitedData = removeTitles(text.split(" "));
      const averageRating = splitedData[0].replace(",", ".");
      const name = splitedData[2].replace(",", "");
      const surname = splitedData[1].replace(",", "");
      const opinionsMatch = /Opinii: (\d+)/.exec(text);
      const visitsMatch = /Odwiedzin: (\d+)/.exec(text);

      const opinionsCount = opinionsMatch !== null ? opinionsMatch[1] : "0";
      const visits = visitsMatch !== null ? visitsMatch[1] : "0";

      return { averageRating, name, surname, opinionsCount, visits };
    })
    .get();

  const nextPageUrlElement = $("tbody")
    .find("ul.vfigntop")
    .find("li.rr")
    .find("div")
    .children("a")
    .filter(function () {
      return $(this).text().includes("następna");
    });
  const nextPageUrl =
    nextPageUrlElement.length > 0
      ? `https://polwro.com/${nextPageUrlElement.attr("href")}`
      : "";
  await delay(Number(env.get("POLWRO_DELAY")));
  return { lecturers, nextPageUrl };
};

const scrapLecturersForCategory = async (url: string, authCookie: string) => {
  let nextPage = url;
  while (nextPage !== "") {
    const result = await scrapLecturersPage(nextPage, authCookie);
    if (result === undefined) {
      break;
    }
    nextPage = result.nextPageUrl;
    for (const lecturer of result.lecturers) {
      await Lecturer.updateOrCreate(
        { name: lecturer.name, surname: lecturer.surname },
        {
          averageRating: lecturer.averageRating,
          opinionsCount: lecturer.opinionsCount,
        },
      );
    }
  }
};

export const scrapLecturers = async () => {
  const authCookie = await loginToPolwro(
    env.get("POLWRO_USERNAME") ?? "",
    env.get("POLWRO_PASSWORD") ?? "",
  );

  for (const url of CATEGORIES_STARTS_URLS) {
    logger.info(`scraping category ${url}`);
    await scrapLecturersForCategory(url, authCookie);
  }
};
