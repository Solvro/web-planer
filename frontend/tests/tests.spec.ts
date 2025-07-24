import { expect, test } from "@playwright/test";

import { BASE_URL, INVALID_EMAIL, VALID_EMAIL } from "./utils/const";
import { selectFacultyAndRegistration } from "./utils/helpers";

test("should navigate to empty plans page without logging in", async ({
  page,
}) => {
  await page.goto(BASE_URL);
  const plansLink = page.getByRole("link", { name: /logowania/i });
  await plansLink.click();
  await expect(page).toHaveURL(/.*\/plans/);
  await expect(page.getByText(/nowy plan/i)).toBeHidden();
});

test("should create empty plan and show proper plans list", async ({
  page,
}) => {
  await page.goto(`${BASE_URL}/plans`);
  await page.getByTestId("add-new-plan-button").click();

  await expect(page).toHaveURL(/\/plans\/edit\/[a-f0-9-]+$/);

  await page.getByRole("link", { name: /plany/i }).click();

  await expect(page.getByText(/nowy plan/i)).toBeVisible();
});

test("should show available classes for selected registration", async ({
  page,
}) => {
  await page.goto(`${BASE_URL}/plans`);
  await page.getByTestId("add-new-plan-button").click();

  await expect(page).toHaveURL(/\/plans\/edit\/[a-f0-9-]+$/);

  await selectFacultyAndRegistration(page);

  const course = page.getByText("Maleszka").first();

  await expect(course).toBeVisible();
});

test("should display proper toast when cannot fetch courses", async ({
  page,
}) => {
  await page.route(
    "**/departments/*/registrations/*/courses",
    async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    },
  );

  await page.goto(`${BASE_URL}/plans`);
  await page.getByTestId("add-new-plan-button").click();

  await selectFacultyAndRegistration(page);

  await page.waitForTimeout(2000);

  await expect(page.getByText(/Coś poszło nie tak/i)).toBeVisible();
});

test("should allow to edit and save plan", async ({ page }) => {
  await page.goto(`${BASE_URL}/plans`);
  await page.getByTestId("add-new-plan-button").click();

  const nameInput = page.locator('input[name="name"]');
  await nameInput.fill("Test Plan");

  await selectFacultyAndRegistration(page);

  const selectedCourse = page.getByText("Kawala").first();
  await selectedCourse.click();
  const disabledCourse = page.getByText("Wojtasik");
  await expect(disabledCourse).toBeDisabled();

  await page.getByRole("link", { name: /plany/i }).click();

  await expect(page.getByText("Test Plan")).toBeVisible();
  await expect(page.getByText("1 kurs")).toBeVisible();
});

test("should allow to share plan with selected courses", async ({ page }) => {
  await page.goto(`${BASE_URL}/plans`);
  await page.getByTestId("add-new-plan-button").click();

  const nameInput = page.locator('input[name="name"]');
  await nameInput.fill("Plan to be shared");

  await selectFacultyAndRegistration(page);

  const firstSelectedCourse = page.getByText("Kawala").first();
  await firstSelectedCourse.click();
  const secondSelectedCourse = page.getByText("Tuzinkiewicz").first();
  await secondSelectedCourse.click();

  await page.getByTestId("share-plan-button").click();

  const generateButton = page.getByText(/wygeneruj/i);
  await expect(generateButton).toBeVisible();
  await generateButton.click();

  const link = await page.getByText("/plans/preview/").textContent();

  await page.goto(link ?? "");

  await expect(page.getByText("Plan to be shared")).toBeVisible();
  await expect(firstSelectedCourse).toBeVisible();

  await page.getByText(/skopiuj/i).click();
  await page.waitForTimeout(2000);

  await expect(page.locator('input[name="name"]')).toHaveValue(
    "Plan to be shared",
  );
});

test("should allow to delete plan", async ({ page }) => {
  await page.goto(`${BASE_URL}/plans`);
  await page.getByTestId("add-new-plan-button").click();

  const nameInput = page.locator('input[name="name"]');
  await nameInput.fill("Plan to be deleted");

  await page.getByRole("link", { name: /plany/i }).click();

  await page.getByTestId("plan-item-dropdown").click();
  await page.getByText("Usuń").click();
  await page.waitForTimeout(2000);
  await page.getByText("Usuń", { exact: true }).click();

  await expect(page.getByText("Plan to be deleted")).toBeHidden();
  await expect(page.getByText(/usunięty/i)).toBeVisible();
});

test("should download plan as .png file", async ({ page }) => {
  await page.goto(`${BASE_URL}/plans`);

  await page.getByTestId("add-new-plan-button").click();

  await page.getByTestId("share-plan-button").click();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByText(/pobierz/i).click(),
  ]);

  const suggestedFilename = download.suggestedFilename();
  expect(suggestedFilename).toMatch(/\.png$/);
});

test("should download plan as .ics file", async ({ page }) => {
  await page.goto(`${BASE_URL}/plans`);

  await page.getByTestId("add-new-plan-button").click();
  await page.getByRole("link", { name: /plany/i }).click();

  await page.getByTestId("plan-item-dropdown").click();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByTestId("download-ics-menu-item").click(),
  ]);

  const suggestedFilename = download.suggestedFilename();
  expect(suggestedFilename).toMatch(/\.ics$/);
});

test("should not allow to report an issue without correct email", async ({
  page,
}) => {
  await page.goto(BASE_URL);
  await page.getByText(/błąd/i).click();

  const emailInput = page.locator('input[name="email"]');
  await emailInput.fill(INVALID_EMAIL);
  await emailInput.press("Enter");

  await expect(page.getByText(/invalid/i)).toBeVisible();
});

test("should allow to report an issue with correct email", async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByText(/błąd/i).click();

  const emailInput = page.locator('input[name="email"]');
  await emailInput.fill(VALID_EMAIL);
  await emailInput.press("Enter");

  await page.waitForTimeout(2000);

  await expect(page.getByText("Przyjęliśmy")).toBeVisible();
});
