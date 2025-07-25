import { type Page, expect, test } from "@playwright/test";

const TEST_EMAIL = process.env.TEST_EMAIL || "test@student.pwr.edu.pl";

async function fillEmailInput(page: Page, email: string) {
  const emailInput = page.getByPlaceholder(/@student/);

  await expect(emailInput).toBeVisible();
  await emailInput.fill(email);
  await emailInput.press("Enter");
}

async function fillOtpInput(page: Page, otp: string) {
  const otpInput = page.getByLabel(/Hasło jednorazowe/i);

  await expect(otpInput).toBeVisible();
  await otpInput.fill(otp);
  await otpInput.press("Enter");
}

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

  test("check if backend failing on github", async ({ page }) => {
    await fillEmailInput(page, TEST_EMAIL);
    await expect(
      page.getByText(/Wystąpił błąd podczas wysyłania kodu/i),
    ).toBeVisible();
  });

  test("submit incorrect otp", async ({ page }) => {
    await fillEmailInput(page, TEST_EMAIL);
    await expect(page.getByLabel(/Hasło jednorazowe/i)).toBeVisible();
    await fillOtpInput(page, "999999");

    await expect(page.getByText(/Logowanie nieudane/i)).toBeVisible();
  });

  test("should submit correct otp", async ({ page }) => {
    await fillEmailInput(page, TEST_EMAIL);
    await expect(page.getByLabel(/Hasło jednorazowe/i)).toBeVisible();
    const otpCode = "123456";

    await fillOtpInput(page, otpCode);

    await expect(page.getByText(/Zalogowano pomyślnie/i)).toBeVisible();
  });
});
