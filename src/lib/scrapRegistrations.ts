/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */

/* eslint-disable no-console */

/* eslint-disable consistent-return */
import * as cheerio from "cheerio";
import fs from "fs";

interface GroupDetails {
  courseName: string;
  groupType: string;
  groupNumber: string;
  week: string;
  day: string;
  startTime: string;
  endTime: string;
  lecturer: string;
}
interface Group {
  url: string;
  groups: GroupDetails[];
}

interface Course {
  name: string;
  url: string;
  groups: Group[];
}
interface Registration {
  name: string;
  url: string;
  courses: Course[];
}

interface Department {
  name: string;
  url: string;
  registrations: Registration[];
}

const DEPARTMENTS_URL =
  "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/index";

const fetchData = async (url: string) => {
  const response = await fetch(url);
  return response;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const scrapDepartments = async () => {
  const departmentsNames: string[] = [];
  const departmentsUrls: string[] = [];
  const response = await fetchData(DEPARTMENTS_URL);
  if (!response.ok) {
    console.log("Something went wrong in fetching departments");
    return;
  }
  const body = await response.text();
  const $ = cheerio.load(body);

  const departments = $("div#layout-c22").find(".autostrong").children("tr");
  departments.each((_, element) => {
    const name = $(element).find("td").html()?.trim();
    if (name !== undefined) {
      departmentsNames.push(name);
    }
    const url = $(element).find("a").attr("href");
    if (url !== undefined) {
      departmentsUrls.push(url);
    }
  });
  return { departmentsNames, departmentsUrls };
};

const scrapRegistrations = async (departmentUrl: string) => {
  const registrationsNames: string[] = [];
  const registrationsUrls: string[] = [];
  const response = await fetchData(departmentUrl);
  if (!response.ok) {
    console.log("Something went wrong in fetching registrations");
    return;
  }
  const body = await response.text();
  const $ = cheerio.load(body);

  const registrations = $("main#layout-main-content")
    .find("#layout-c22")
    .find("div.usos-ui");
  const h2 = registrations.children("h2");
  const names = registrations.children("usos-link");
  h2.each((_, element) => {
    registrationsNames.push($(element).text().trim());
  });
  names.each((_, element) => {
    const url = $(element).find("a").attr("href");
    if (url !== undefined) {
      registrationsUrls.push(url);
    }
  });
  return { registrationsNames, registrationsUrls };
};

const scrapCourses = async (registrationUrl: string) => {
  const coursesUrls: string[] = [];
  const response = await fetchData(registrationUrl);
  if (!response.ok) {
    console.log("Something went wrong in fetching courses");
    return;
  }

  const body = await response.text();
  const $ = cheerio.load(body);

  const courses = $("main#layout-main-content")
    .find("table.wrnav")
    .find("tbody")
    .children("tr");
  courses.each((_, element) => {
    const courseUrl = $(element).find("usos-link").find("a").attr("href");
    if (courseUrl !== undefined) {
      coursesUrls.push(courseUrl);
    }
  });
  return coursesUrls;
};

const scrapCourseNameGroupsUrls = async (courseUrl: string) => {
  let courseName = "";
  const urls: string[] = [];
  const response = await fetchData(courseUrl);
  if (!response.ok) {
    console.log("Something went wrong in fetching groups");
    return;
  }

  const body = await response.text();
  const $ = cheerio.load(body);

  courseName = $("main-panel#main").find("h1").text();
  const groups = $("div#layout-c22").find("div.usos-ui").children("usos-frame");
  groups.each((_, element) => {
    const title = $(element).find("h2");
    if (title.text().includes("(jeszcze nie rozpoczęty)")) {
      const linksToSubCourses = $(element).find("usos-link").children("a");
      linksToSubCourses.each((__, el) => {
        const url = $(el).attr("href");
        if (url !== undefined) {
          urls.push(url);
        }
      });
    }
  });
  return { courseName, urls };
};

const scrapGroupsUrls = async (groupUrl: string) => {
  const groupsUrls: string[] = [];
  const response = await fetchData(groupUrl);
  if (!response.ok) {
    console.log("Something went wrong in fetching groups");
    return;
  }

  const body = await response.text();
  const $ = cheerio.load(body);

  const groups = $("div#layout-c22").find("table").find("tbody").children("tr");
  groups.each((_, element) => {
    const link = $(element).find("usos-link").find("a").attr("href");
    if (link !== undefined) {
      groupsUrls.push(link);
    }
  });
  return groupsUrls;
};

const scrapGroupDetails = async (groupUrl: string) => {
  const response = await fetchData(groupUrl);
  if (!response.ok) {
    console.log("Something went wrong in fetching groups");
    return;
  }

  const body = await response.text();
  const $ = cheerio.load(body);

  const mainContent = $("div#layout-c22");

  const courseName = mainContent.find("h1").find("a").text().trim();
  const groupType = giveGroupType(mainContent.find("h1").text().trim());
  const groupNumber = getGroupNumber(mainContent.find("h1").text());

  const dayWeek = mainContent
    .find("table")
    .find("tbody")
    .find("tr")
    .eq(2)
    .find("td")
    .eq(1);
  const week = checkWeek(dayWeek.text());
  const day = checkDay(dayWeek.text());
  const { startTime, endTime } = getStartEndTime(
    mainContent
      .find("table")
      .find("tbody")
      .find("tr")
      .eq(2)
      .find("td")
      .eq(1)
      .text()
      .trim(),
  );
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
  return {
    courseName,
    groupType,
    groupNumber,
    week,
    day,
    startTime,
    endTime,
    lecturer,
  };
};

const getStartEndTime = (time: string) => {
  if (time.includes("brak danych")) {
    return { startTime: "00:00", endTime: "00:00" };
  }
  try {
    const regex = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/;
    const match = regex.exec(time);

    if (match) {
      const startTime = match[1];
      const endTime = match[2];
      return { startTime, endTime };
    }
    return { startTime: "00:00", endTime: "00:00" };
  } catch (error) {
    return { startTime: "error", endTime: "error" };
  }
};

const giveGroupType = (groupType: string) => {
  if (groupType.includes("Ćwiczenia")) {
    return "C";
  } else if (groupType.includes("Zajęcia")) {
    return "L";
  } else if (groupType.includes("Projekt")) {
    return "P";
  } else if (groupType.includes("Seminarium")) {
    return "S";
  } else if (groupType.includes("Wykład")) {
    return "W";
  }
  return "Unknown";
};

const getGroupNumber = (groupInfo: string) => {
  const regex = /grupa nr (\d+)/;
  const match = regex.exec(groupInfo);
  return match ? match[1] : "1";
};

const checkWeek = (week: string) => {
  if (week.includes("(nieparzyste)")) {
    return "TN";
  } else if (week.includes("(parzyste)")) {
    return "TP";
  }
  return "";
};

const checkDay = (day: string) => {
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
  return "unknown";
};

//'https://web.usos.pwr.edu.pl/kontroler.php?_action=katalog2/przedmioty/szukajPrzedmiotu&method=rej&rej_kod=W09ZARZ-SI7-24%2F25Zv&callback=g_f04839bf'

const main = async () => {
  //scrap departments
  // const { departmentsNames, departmentsUrls } = await scrapDepartments();
  // const departemnts = departmentsNames.map((name, index) => {
  //   return { name, url: departmentsUrls[index], registrations: [] };
  // });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const departments: Department[] = JSON.parse(
    fs.readFileSync("departments.json", "utf8"),
  );
  const department1 = departments[2];
  const registrationsNamesUrls = await scrapRegistrations(department1.url);
  let registrationsNames: string[] = [];
  let registrationsUrls: string[] = [];
  if (registrationsNamesUrls !== undefined) {
    registrationsNames = registrationsNamesUrls.registrationsNames;
    registrationsUrls = registrationsNamesUrls.registrationsUrls;
  }
  department1.registrations = registrationsNames.map((name, index) => {
    return { name, url: registrationsUrls[index], courses: [] };
  });
  for (const registration of department1.registrations) {
    const coursesUrls = await scrapCourses(registration.url);
    if (coursesUrls !== undefined) {
      registration.courses = coursesUrls.map((url) => {
        return { url, groups: [], name: "" };
      });
    }

    for (const course of registration.courses) {
      let courseName = "";
      let urls: string[] = [];
      const courseNameGroupsUrls = await scrapCourseNameGroupsUrls(course.url);
      if (courseNameGroupsUrls !== undefined) {
        courseName = courseNameGroupsUrls.courseName;
        urls = courseNameGroupsUrls.urls;
      }
      course.name = courseName;
      course.groups = urls.map((url) => {
        return { url, groups: [] };
      });
      for (const group of course.groups) {
        const detailsUrls = await scrapGroupsUrls(group.url);
        if (detailsUrls !== undefined) {
          for (const url of detailsUrls) {
            const details = await scrapGroupDetails(url);
            if (details !== undefined) {
              group.groups.push(details);
            }
          }
        }
      }
    }
  }
  const dataToSave = JSON.stringify(department1, null, 2);
  fs.writeFileSync("dep-test-wf.json", dataToSave, "utf8");
};

void main();
