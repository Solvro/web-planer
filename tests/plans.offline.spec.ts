import { expect, test } from "@playwright/test";

import { selectFacultyAndRegistration } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/plans");
});

test.describe("Plans logic offline", () => {
  test("should display plans page", async ({ page }) => {
    await expect(page).toHaveTitle(/Planer - utwórz swój plan zajęć na PWR!/i);
    await expect(
      page.getByRole("heading", { name: "Planer", level: 1 }),
    ).toBeVisible();
  });

  test("should display login button", async ({ page }) => {
    await expect(page.getByText(/Zaloguj się/i)).toBeVisible();
  });

  test("should create empty plan", async ({ page }) => {
    const button = page.getByTestId("create-plan-button");
    await button.click();
    await expect(page.getByText(/Ostatnia aktualizacja onli/i)).toBeVisible();
  });

  test("should show plan options", async ({ page }) => {
    const button = page.getByTestId("create-plan-button");
    await button.click();
    await expect(page.getByText(/Ostatnia aktualizacja onli/i)).toBeVisible();
    await selectFacultyAndRegistration(page);
    const course = page.getByText("Kowalska").first();
    await expect(course).toBeVisible();
  });

  test("should allow to edit and save plan", async ({ page }) => {
    const button = page.getByTestId("create-plan-button");
    await button.click();

    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill("Lesssgo planik");

    await selectFacultyAndRegistration(page);

    const selectedCourse = page.getByText("Kowalska").first();
    await selectedCourse.click();

    const selectedCourse2 = page.getByText("Kurzyna").first();
    await selectedCourse2.click();

    const disabledCourse = page.getByText("Kowalski");
    await expect(disabledCourse).toBeDisabled();

    await page.goto("/plans");

    await expect(page.getByText("Lesssgo planik")).toBeVisible();
    await expect(page.getByText("1 kurs")).toBeVisible();
    await expect(page.getByText("2 wybrane grupy")).toBeVisible();
  });

  test("should allow to delete saved plan", async ({ page }) => {
    await page.getByTestId("create-plan-button").click();

    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill("Trash planik");

    await page.goto("/plans");

    await page.getByTestId("plan-item-dropdown").click();
    await page.getByText("Usuń").click();
    await page.waitForTimeout(1000);
    await page.getByText("Usuń", { exact: true }).click();

    await expect(page.getByText("Trash planik")).toBeHidden();
    await expect(page.getByText(/usunięty/i)).toBeVisible();
  });

  test("should display error toast when fetching courses fails", async ({
    page,
  }) => {
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

    await page.getByTestId("create-plan-button").click();

    await selectFacultyAndRegistration(page);

    await page.waitForTimeout(2000);

    await expect(page.getByText(/coś poszło nie tak/i)).toBeVisible();
  });
});

test.describe("Report form tests", () => {
  test("should not allow to report an issue with invalid email", async ({
    page,
  }) => {
    await page.getByText(/błąd/i).click();

    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill("dasjdksadksjadsd");
    await emailInput.press("Enter");

    await expect(page.getByText(/owadź poprawny adr/i)).toBeVisible();
  });

  test("should not allow to report an issue with invalid title and description", async ({
    page,
  }) => {
    await page.getByText(/błąd/i).click();

    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill("hapy@student.pwr.edu.pl");
    await emailInput.press("Enter");

    await expect(page.getByText(/tuł musi mieć/i)).toBeVisible();
    await expect(page.getByText(/pis musi mieć co/i)).toBeVisible();
  });

  test("should allow to report an issue with valid inputs", async ({
    page,
  }) => {
    await page.getByText(/błąd/i).click();

    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill("sad@student.pwr.edu.pl");

    const titleInput = page.locator('input[name="title"]');
    await titleInput.fill("Tytuł z 5 znakami");

    const descriptionInput = page.locator('textarea[name="description"]');
    await descriptionInput.fill("Opis, który ma więcej niż 10 znaków");

    await emailInput.press("Enter");

    await page.waitForTimeout(2000);

    await expect(page.getByText("Przyjęliśmy")).toBeVisible();
  });
});
