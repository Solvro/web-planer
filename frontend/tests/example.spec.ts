import { expect, test } from "@playwright/test";

import { BASE_URL, MOCK_COURSES, MOCK_REGISTRATIONS } from "./const";

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
  await page.locator("button.border-dashed").click();

  await expect(page).toHaveURL(/\/plans\/edit\/[a-f0-9-]+$/);

  const plansLink = page.getByRole("link", { name: /plany/i });
  await plansLink.click();

  await expect(page.getByText(/nowy plan/i)).toBeVisible();
});

test("should create plan", async ({ page }) => {
  await page.route("**/departments/W4N/registrations", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_REGISTRATIONS),
    });
  });

  // MOCK: courses
  await page.route(
    "**/departments/W4N/registrations/W04-IST-SI-6-24L/courses",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_COURSES),
      });
    },
  );

  await page.goto(`${BASE_URL}/plans`);
  await page.locator("button.border-dashed").click();

  await expect(page).toHaveURL(/\/plans\/edit\/[a-f0-9-]+$/);

  const nameInput = page.locator('input[name="name"]');
  await nameInput.fill("Test Plan");

  const facultyButton = page.locator(
    'button[role="combobox"]:has-text("Wybierz swój wydział")',
  );

  await facultyButton.click();

  const chosenFaculty = page.getByRole("option", { name: /w4n/i });

  await chosenFaculty.click();

  const registrationButton = page.locator('button[name="registration"]');

  await registrationButton.click();

  const registrationInput = page.getByPlaceholder("Wybierz rejestrację...");

  await registrationInput.fill("IST SI SEM.6");

  const chosenRegistration = page.getByRole("option").first();

  await chosenRegistration.click();

  const plansLink = page.getByRole("link", { name: /plany/i });
  await plansLink.click();

  await expect(page.getByText(/Test Plan/i)).toBeVisible();
});
