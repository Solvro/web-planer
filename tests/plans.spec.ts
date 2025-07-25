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

  // test.afterEach(async ({ page }) => {
  //   await page.goto("/plans");

  //   while (true) {
  //     const plans = page.locator('[data-testid="plan-item"]');
  //     const planCount = await plans.count();

  //     if (planCount === 0) {
  //       break;
  //     }

  //     const firstPlan = plans.first();
  //     const dropdownButton = firstPlan.getByTestId("plan-item-dropdown");

  //     await expect(dropdownButton).toBeVisible();
  //     await expect(dropdownButton).toBeEnabled();

  //     await page.waitForTimeout(500);

  //     await dropdownButton.click();

  //     const deleteButton = page.getByText("Usuń");
  //     await expect(deleteButton).toBeVisible();
  //     await deleteButton.click();
  //     await page.waitForTimeout(2000);
  //     await page.getByText("Usuń", { exact: true }).click();
  //     await page.waitForTimeout(1000);
  //   }
  // });

  test("should display plans page", async ({ page }) => {
    console.log("should display plans page - 1");
    await expect(page).toHaveTitle(/Planer - utwórz swój plan zajęć na PWR!/i);
    console.log("should display plans page - 2");
    await expect(
      page.getByRole("heading", { name: "Planer", level: 1 }),
    ).toBeVisible();
    console.log("should display plans page - 3");
  });

  test("shouldnt display login button", async ({ page }) => {
    console.log("should display login button - 1");
    await expect(page.getByText(/Zaloguj się/i)).not.toBeVisible();
    console.log("should display login button - 2");
  });

  test("should create empty plan", async ({ page }) => {
    console.log("should create empty plan - 1");
    const button = page.getByTestId("create-plan-button");
    await button.click();
    console.log("should create empty plan - 2");
    await expect(page.getByText(/Ostatnia aktualizacja onli/i)).toBeVisible();
    await expect(page.getByText(/Utworzono plan/i)).toBeVisible();
    console.log("should create empty plan - 3");
    await checkIfSaved(page);
    await expect(page.getByText("Brak kursów")).toBeVisible();
  });

  test("should show plan options and save", async ({ page }) => {
    console.log("should show plan options - 1");
    const button = page.getByTestId("create-plan-button");
    await button.click();
    console.log("should show plan options - 2");
    await expect(page.getByText(/Ostatnia aktualizacja onli/i)).toBeVisible();
    await page.waitForTimeout(3000);
    console.log("should show plan options - 3");
    await selectFacultyAndRegistration(page);
    console.log("should show plan options - 4");
    const course = page.getByText("Kowalska").first();
    await expect(course).toBeVisible();
    console.log("should show plan options - 5");
    await checkIfSaved(page);
    console.log("should show plan options - 6");
  });

  test("should allow to edit and save plan", async ({ page }) => {
    console.log("should allow to edit and save plan - 1");
    const button = page.getByTestId("create-plan-button");
    await button.click();

    console.log("should allow to edit and save plan - 2");
    await page.waitForTimeout(3000);

    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill("Lesssgo planik");

    console.log("should allow to edit and save plan - 3");

    await selectFacultyAndRegistration(page);
    console.log("should allow to edit and save plan - 4");

    const selectedCourse = page.getByText("Kowalska").first();
    await selectedCourse.click();
    console.log("should allow to edit and save plan - 5");

    const selectedCourse2 = page.getByText("Kurzyna").first();
    await selectedCourse2.click();
    console.log("should allow to edit and save plan - 6");

    const disabledCourse = page.getByText("Kowalski");
    await expect(disabledCourse).toBeDisabled();
    console.log("should allow to edit and save plan - 7");

    await checkIfSaved(page);
    console.log("should allow to edit and save plan - 8");

    await page.goto("/plans");
    console.log("should allow to edit and save plan - 9");

    await expect(page.getByText("Lesssgo planik")).toBeVisible();
    console.log("should allow to edit and save plan - 9");
    await expect(page.getByText("1 kurs")).toBeVisible();
    await expect(page.getByText("2 wybrane grupy")).toBeVisible();
    console.log("should allow to edit and save plan - 10");
  });

  test("should allow to delete saved plan", async ({ page }) => {
    console.log("should allow to delete saved plan - 1");
    await page.getByTestId("create-plan-button").click();
    console.log("should allow to delete saved plan - 2");
    await page.waitForTimeout(3000);

    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill("Trash planik");
    await checkIfSaved(page);
    console.log("should allow to delete saved plan - 3");

    await page.goto("/plans");
    console.log("should allow to delete saved plan - 4");

    await page.getByTestId("plan-item-dropdown").first().click();
    console.log("should allow to delete saved plan - 5");
    await page.getByText("Usuń").click();
    console.log("should allow to delete saved plan - 6");
    await page.waitForTimeout(1000);
    await page.getByText("Usuń", { exact: true }).click();
    console.log("should allow to delete saved plan - 7");

    await expect(page.getByText("Trash planik")).toBeHidden();
    await expect(page.getByText(/usunięty/i)).toBeVisible();
    console.log("should allow to delete saved plan - 8");
  });
});
