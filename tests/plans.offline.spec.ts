import { expect, test } from "@playwright/test";

import { selectFacultyAndRegistration } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/plans");
});

test.describe("Plans logic offline", () => {
  test("should display plans page", async ({ page }) => {
    console.log("should display plans page - 1");
    await expect(page).toHaveTitle(/Planer - utwórz swój plan zajęć na PWR!/i);
    console.log("should display plans page - 2");
    await expect(
      page.getByRole("heading", { name: "Planer", level: 1 }),
    ).toBeVisible();
    console.log("should display plans page - 3");
  });

  test("should display login button", async ({ page }) => {
    console.log("should display login button - 1");
    await expect(page.getByText(/Zaloguj się/i)).toBeVisible();
    console.log("should display login button - 2");
  });

  test("should create empty plan", async ({ page }) => {
    console.log("should create empty plan - 1");
    const button = page.getByTestId("create-plan-button");
    await button.click();
    console.log("should create empty plan - 2");
    await expect(page.getByText(/Ostatnia aktualizacja onli/i)).toBeVisible();
    console.log("should create empty plan - 3");
  });

  test("should show plan options", async ({ page }) => {
    console.log("should show plan options - 1");
    const button = page.getByTestId("create-plan-button");
    await button.click();
    console.log("should show plan options - 2");
    await expect(page.getByText(/Ostatnia aktualizacja onli/i)).toBeVisible();
    console.log("should show plan options - 3");
    await selectFacultyAndRegistration(page);
    console.log("should show plan options - 4");
    const course = page.getByText("Kowalska").first();
    await expect(course).toBeVisible();
    console.log("should show plan options - 5");
  });

  test("should allow to edit and save plan", async ({ page }) => {
    console.log("should allow to edit and save plan - 1");
    const button = page.getByTestId("create-plan-button");
    await button.click();
    console.log("should allow to edit and save plan - 2");
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill("Lesssgo planik");
    console.log("should allow to edit and save plan - 3");
    await selectFacultyAndRegistration(page);

    const selectedCourse = page.getByText("Kowalska").first();
    await selectedCourse.click();
    console.log("should allow to edit and save plan - 4");
    const selectedCourse2 = page.getByText("Kurzyna").first();
    await selectedCourse2.click();
    console.log("should allow to edit and save plan - 5");
    const disabledCourse = page.getByText("Kowalski");
    await expect(disabledCourse).toBeDisabled();
    console.log("should allow to edit and save plan - 6");
    await page.goto("/plans");
    console.log("should allow to edit and save plan - 7");
    await expect(page.getByText("Lesssgo planik")).toBeVisible();
    await expect(page.getByText("1 kurs")).toBeVisible();
    await expect(page.getByText("2 wybrane grupy")).toBeVisible();
    console.log("should allow to edit and save plan - 8");
  });

  test("should allow to delete saved plan", async ({ page }) => {
    console.log("should allow to delete saved plan - 1");
    await page.getByTestId("create-plan-button").click();
    console.log("should allow to delete saved plan - 2");
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill("Trash planik");
    console.log("should allow to delete saved plan - 3");
    await page.goto("/plans");
    console.log("should allow to delete saved plan - 4");
    await page.getByTestId("plan-item-dropdown").click();
    await page.getByText("Usuń").click();
    await page.waitForTimeout(1000);
    await page.getByText("Usuń", { exact: true }).click();
    console.log("should allow to delete saved plan - 5");
    await expect(page.getByText("Trash planik")).toBeHidden();
    await expect(page.getByText(/usunięty/i)).toBeVisible();
    console.log("should allow to delete saved plan - 6");
  });

  test("should display error toast when fetching courses fails", async ({
    page,
  }) => {
    console.log("should display error toast when fetching courses fails - 1");
    await page.route(
      "http://localhost:3333/departments/W5/registrations/W05-APR-SI-3-25Z/courses",
      async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ message: "Internal Server Error" }),
        });
      },
    );
    console.log("should display error toast when fetching courses fails - 2");
    await page.getByTestId("create-plan-button").click();
    console.log("should display error toast when fetching courses fails - 3");
    await selectFacultyAndRegistration(page);
    console.log("should display error toast when fetching courses fails - 4");
    await page.waitForTimeout(2000);
    console.log("should display error toast when fetching courses fails - 5");
    await expect(page.getByText(/coś poszło nie tak/i)).toBeVisible();
    console.log("should display error toast when fetching courses fails - 6");
  });
});

test.describe("Report form tests", () => {
  test("should not allow to report an issue with invalid email", async ({
    page,
  }) => {
    console.log("should not allow to report an issue with invalid email - 1");
    await page.getByText(/błąd/i).click();
    console.log("should not allow to report an issue with invalid email - 2");
    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill("dasjdksadksjadsd");
    await emailInput.press("Enter");
    console.log("should not allow to report an issue with invalid email - 3");
    await expect(page.getByText(/owadź poprawny adr/i)).toBeVisible();
    console.log("should not allow to report an issue with invalid email - 4");
  });

  test("should not allow to report an issue with invalid title and description", async ({
    page,
  }) => {
    await page.getByText(/błąd/i).click();
    console.log(
      "should not allow to report an issue with invalid title and description - 1",
    );
    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill("hapy@student.pwr.edu.pl");
    await emailInput.press("Enter");
    console.log(
      "should not allow to report an issue with invalid title and description - 2",
    );
    await expect(page.getByText(/tuł musi mieć/i)).toBeVisible();
    await expect(page.getByText(/pis musi mieć co/i)).toBeVisible();
    console.log(
      "should not allow to report an issue with invalid title and description - 3",
    );
  });

  test("should allow to report an issue with valid inputs", async ({
    page,
  }) => {
    await page.getByText(/błąd/i).click();
    console.log("should allow to report an issue with valid inputs - 1");
    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill("sad@student.pwr.edu.pl");
    console.log("should allow to report an issue with valid inputs - 2");

    const titleInput = page.locator('input[name="title"]');
    await titleInput.fill("Tytuł z 5 znakami");
    console.log("should allow to report an issue with valid inputs - 3");

    const descriptionInput = page.locator('textarea[name="description"]');
    await descriptionInput.fill("Opis, który ma więcej niż 10 znaków");
    console.log("should allow to report an issue with valid inputs - 4");

    await emailInput.press("Enter");
    console.log("should allow to report an issue with valid inputs - 5");

    await page.waitForTimeout(2000);

    await expect(page.getByText("Przyjęliśmy")).toBeVisible();
    console.log("should allow to report an issue with valid inputs - 6");
  });
});
