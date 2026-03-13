import { test } from "@japa/runner";

import { getOtpValidator, verifyOtpValidator } from "#validators/otp";

test.group("Validator | getOtp", () => {
  test("accepts a valid @student.pwr.edu.pl email", async ({ assert }) => {
    await assert.doesNotReject(() =>
      getOtpValidator.validate({ email: "123456@student.pwr.edu.pl" }),
    );
  });

  test("rejects an email with wrong domain", async ({ assert }) => {
    await assert.rejects(() =>
      getOtpValidator.validate({ email: "test@gmail.com" }),
    );
  });

  test("rejects an email with a subdomain of the allowed domain", async ({
    assert,
  }) => {
    await assert.rejects(() =>
      getOtpValidator.validate({
        email: "test@mail.student.pwr.edu.pl",
      }),
    );
  });

  test("rejects a non-email string", async ({ assert }) => {
    await assert.rejects(() =>
      getOtpValidator.validate({ email: "not-an-email" }),
    );
  });

  test("rejects an empty string", async ({ assert }) => {
    await assert.rejects(() => getOtpValidator.validate({ email: "" }));
  });

  test("rejects when the email field is missing", async ({ assert }) => {
    await assert.rejects(() => getOtpValidator.validate({} as any));
  });
});

test.group("Validator | verifyOtp", () => {
  test("accepts a valid email and 6-character OTP", async ({ assert }) => {
    await assert.doesNotReject(() =>
      verifyOtpValidator.validate({
        email: "123456@student.pwr.edu.pl",
        otp: "A1B2C3",
      }),
    );
  });

  test("rejects an OTP shorter than 6 characters", async ({ assert }) => {
    await assert.rejects(() =>
      verifyOtpValidator.validate({
        email: "123456@student.pwr.edu.pl",
        otp: "123",
      }),
    );
  });

  test("rejects an OTP longer than 6 characters", async ({ assert }) => {
    await assert.rejects(() =>
      verifyOtpValidator.validate({
        email: "123456@student.pwr.edu.pl",
        otp: "1234567",
      }),
    );
  });

  test("rejects a wrong email domain even with valid OTP", async ({
    assert,
  }) => {
    await assert.rejects(() =>
      verifyOtpValidator.validate({
        email: "test@gmail.com",
        otp: "ABCDEF",
      }),
    );
  });

  test("rejects when otp field is missing", async ({ assert }) => {
    await assert.rejects(() =>
      verifyOtpValidator.validate({
        email: "123456@student.pwr.edu.pl",
      } as any),
    );
  });
});
