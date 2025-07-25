import { type Page, expect, test } from "@playwright/test";

import { TEST_EMAIL, fillEmailInput, fillOtpInput } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
});

test.describe("Login tests", () => {
  test("should display login page", async ({ page }) => {
    await expect(page).toHaveTitle(/Planer - utwórz swój plan zajęć na PWR!/i);
    await expect(
      page.getByRole("heading", { name: "Zaloguj się do planera", level: 1 }),
    ).toBeVisible();
  });

  test("submit incorrect email", async ({ page }) => {
    await fillEmailInput(page, "kfjdskfjkdskfldsjlfjdskljfsd@test.pl");

    await expect(page.getByText(/il musi być z domeny Polite/i)).toBeVisible();
  });

  test("submit incorrect otp", async ({ page }) => {
    await fillEmailInput(page, TEST_EMAIL);
    await expect(page.getByLabel(/Hasło jednorazowe/i)).toBeVisible();
    await fillOtpInput(page, "999999");
    await expect(page.getByText(/Logowanie nieudane/i)).toBeVisible();
  });

  test("submit correct otp", async ({ page }) => {
    await fillEmailInput(page, TEST_EMAIL);
    await expect(page.getByLabel(/Hasło jednorazowe/i)).toBeVisible();
    await fillOtpInput(page, "123456");
    await expect(page.getByText(/Zalogowano pomyślnie/i)).toBeVisible();
  });
});
