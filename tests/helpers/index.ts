import { Page, expect } from "@playwright/test";

export const selectFacultyAndRegistration = async (page: Page) => {
  console.log("selectFacultyAndRegistration - 1");
  const facultyButton = page.getByText(/wybierz swój/i);
  await facultyButton.click();
  console.log("selectFacultyAndRegistration - 2");
  const chosenFaculty = page.getByRole("option", { name: /w5/i });
  await chosenFaculty.click();
  console.log("selectFacultyAndRegistration - 3");
  const registrationButton = page.locator('button[name="registration"]');
  await registrationButton.click();
  console.log("selectFacultyAndRegistration - 4");
  const registrationInput = page.getByPlaceholder("Wybierz rejestrację...");
  await registrationInput.fill(
    "W5 zapisy wydziałowe dla kierunku APR SI 3 SEM, 2025/26Z W05-APRP-000P-OSIW7 [W05-APR-SI-3-25Z]",
  );
  console.log("selectFacultyAndRegistration - 5");
  const chosenRegistration = page.getByRole("option").first();
  await chosenRegistration.click();
  console.log("selectFacultyAndRegistration - 6");
};

export const TEST_EMAIL = process.env.TEST_EMAIL || "test@student.pwr.edu.pl";

export const fillEmailInput = async (page: Page, email: string) => {
  const emailInput = page.getByPlaceholder(/@student/);

  await expect(emailInput).toBeVisible();
  await emailInput.fill(email);
  await emailInput.press("Enter");
};

export const fillOtpInput = async (page: Page, otp: string) => {
  const otpInput = page.getByLabel(/Hasło jednorazowe/i);

  await expect(otpInput).toBeVisible();
  await otpInput.fill(otp);
  await otpInput.press("Enter");
};

export const loginToSiteFirst = async (page: Page) => {
  await page.goto("/login");
  await fillEmailInput(page, TEST_EMAIL);
  await expect(page.getByLabel(/Hasło jednorazowe/i)).toBeVisible();
  await fillOtpInput(page, "123456");
  await expect(page.getByText(/Zalogowano pomyślnie/i)).toBeVisible();
  await page.goto("/plans");
};

export const checkIfSaved = async (page: Page) => {
  await page.waitForTimeout(8000);
  const syncedButton = page.locator('[data-testId="synced-button"]');
  const iconInSyncedButton = syncedButton.locator("svg>path");
  const expectedIconPath =
    "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z";
  await expect(iconInSyncedButton).toHaveAttribute("d", expectedIconPath);
};
