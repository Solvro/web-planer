import type { Page } from "@playwright/test";

export const selectFacultyAndRegistration = async (page: Page) => {
  const facultyButton = page.getByText(/wybierz/i);

  await facultyButton.click();

  const chosenFaculty = page.getByRole("option", { name: /w4n/i });

  await chosenFaculty.click();

  const registrationButton = page.locator('button[name="registration"]');

  await registrationButton.click();

  const registrationInput = page.getByPlaceholder("Wybierz rejestrację...");

  await registrationInput.fill("IST SI SEM.6");

  const chosenRegistration = page.getByRole("option").first();
  await chosenRegistration.click();
};
