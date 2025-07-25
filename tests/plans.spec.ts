import { type Page, expect, test } from "@playwright/test";

import {
  checkIfSaved,
  loginToSiteFirst,
  selectFacultyAndRegistration,
} from "./helpers";

test.describe("Plans logic online", () => {
  test.beforeEach(async ({ page }) => {
    await loginToSiteFirst(page);
  });

  test.afterEach(async ({ page }) => {
    await page.goto("/plans");

    while (true) {
      const plans = page.locator('[data-testid="plan-item"]');
      const planCount = await plans.count();

      if (planCount === 0) {
        break;
      }

      const firstPlan = plans.first();
      const dropdownButton = firstPlan.getByTestId("plan-item-dropdown");

      await expect(dropdownButton).toBeVisible();
      await expect(dropdownButton).toBeEnabled();

      await page.waitForTimeout(500);

      await dropdownButton.click();

      const deleteButton = page.getByText("Usuń");
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();
      await page.waitForTimeout(2000);
      await page.getByText("Usuń", { exact: true }).click();
      await page.waitForTimeout(1000);
    }
  });

  test("should display plans page", async ({ page }) => {
    await expect(page).toHaveTitle(/Planer - utwórz swój plan zajęć na PWR!/i);
    await expect(
      page.getByRole("heading", { name: "Planer", level: 1 }),
    ).toBeVisible();
  });

  test("shouldnt display login button", async ({ page }) => {
    await expect(page.getByText(/Zaloguj się/i)).not.toBeVisible();
  });

  test("should create empty plan", async ({ page }) => {
    const button = page.getByTestId("create-plan-button");
    await button.click();
    await expect(page.getByText(/Ostatnia aktualizacja onli/i)).toBeVisible();
    await expect(page.getByText(/Utworzono plan/i)).toBeVisible();
    await checkIfSaved(page);
  });

  test("should show plan options and save", async ({ page }) => {
    const button = page.getByTestId("create-plan-button");
    await button.click();
    await expect(page.getByText(/Ostatnia aktualizacja onli/i)).toBeVisible();
    await page.waitForTimeout(3000);
    await selectFacultyAndRegistration(page);
    const course = page.getByText("Kowalska").first();
    await expect(course).toBeVisible();
    await checkIfSaved(page);
  });

  test("should allow to edit and save plan", async ({ page }) => {
    const button = page.getByTestId("create-plan-button");
    await button.click();

    await page.waitForTimeout(3000);

    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill("Lesssgo planik");

    await selectFacultyAndRegistration(page);

    const selectedCourse = page.getByText("Kowalska").first();
    await selectedCourse.click();

    const selectedCourse2 = page.getByText("Kurzyna").first();
    await selectedCourse2.click();

    const disabledCourse = page.getByText("Kowalski");
    await expect(disabledCourse).toBeDisabled();

    await checkIfSaved(page);

    await page.goto("/plans");

    await expect(page.getByText("Lesssgo planik")).toBeVisible();
    await expect(page.getByText("1 kurs")).toBeVisible();
    await expect(page.getByText("2 wybrane grupy")).toBeVisible();
  });

  test("should allow to delete saved plan", async ({ page }) => {
    await page.getByTestId("create-plan-button").click();

    await page.waitForTimeout(3000);

    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill("Trash planik");
    await checkIfSaved(page);

    await page.goto("/plans");

    await page.getByTestId("plan-item-dropdown").first().click();
    await page.getByText("Usuń").click();
    await page.waitForTimeout(1000);
    await page.getByText("Usuń", { exact: true }).click();

    await expect(page.getByText("Trash planik")).toBeHidden();
    await expect(page.getByText(/usunięty/i)).toBeVisible();
  });
});
