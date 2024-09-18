// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair

/* eslint-disable no-console */
import * as cheerio from "cheerio";

const DEPARTMENTS_URL =
  "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/index";

const fetchData = async (url: string) => {
  const response = await fetch(url);
  return response;
};

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
  departments.each((index, element) => {
    departmentsNames.push($(element).find("td").html()?.trim());
    departmentsUrls.push($(element).find("a").attr("href"));
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
  h2.each((index, element) => {
    registrationsNames.push($(element).text().trim());
  });
  names.each((index, element) => {
    registrationsUrls.push($(element).find("a").attr("href"));
  });
  return { registrationsNames, registrationsUrls };
};

const scrapCourses = async (registrationUrl: string) => {
  const coursesNames: string[] = [];
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
  courses.each((index, element) => {
    const a = $(element).find("usos-link").find("a").attr("href");
    console.log(a);
  });
};

//'https://web.usos.pwr.edu.pl/kontroler.php?_action=katalog2/przedmioty/szukajPrzedmiotu&method=rej&rej_kod=W09ZARZ-SI7-24%2F25Zv&callback=g_f04839bf'

const main = async () => {
  const { departmentsNames, departmentsUrls } = await scrapDepartments();

  const registrations: string[][] = [];
  const allRegistrationsUrls: string[][] = [];

  for (const department of departmentsUrls) {
    const { registrationsNames, registrationsUrls } =
      await scrapRegistrations(department);
    registrations.push(registrationsNames);
    allRegistrationsUrls.push(registrationsUrls);
  }
  console.log(registrations, allRegistrationsUrls);
};

//void main();
//test scrapCourses
void scrapCourses(
  "https://web.usos.pwr.edu.pl/kontroler.php?_action=katalog2/przedmioty/szukajPrzedmiotu&method=rej&rej_kod=W09ZARZ-SI7-24%2F25Zv&callback=g_f04839bf",
);
