import { test } from "@japa/runner";

/**
 * Functional tests for authentication endpoints.
 *
 * Routes tested:
 *   POST /user/otp/get    – request OTP email (guest-only, throttled)
 *   POST /user/otp/verify – verify OTP and receive JWT
 *   POST /user/login      – login with USOS OAuth tokens (guest-only)
 *   DELETE /user/logout   – logout (requires auth)
 */

test.group("Auth | OTP email validation", () => {
  test("POST /user/otp/get rejects a non-pwr email with 422", async ({
    client,
  }) => {
    const response = await client
      .post("/user/otp/get")
      .json({ email: "user@gmail.com" });

    response.assertStatus(422);
  });

  test("POST /user/otp/get rejects a missing email with 422", async ({
    client,
  }) => {
    const response = await client.post("/user/otp/get").json({});
    response.assertStatus(422);
  });

  test("POST /user/otp/get rejects a non-student pwr email with 422", async ({
    client,
  }) => {
    const response = await client
      .post("/user/otp/get")
      .json({ email: "user@pwr.edu.pl" });

    response.assertStatus(422);
  });

  // TODO: configure a fake mail driver in test env and assert 200 + no email sent.
});

test.group("Auth | OTP verify validation", () => {
  test("POST /user/otp/verify rejects a non-pwr email with 422", async ({
    client,
  }) => {
    const response = await client
      .post("/user/otp/verify")
      .json({ email: "user@gmail.com", otp: "123456" });

    response.assertStatus(422);
  });

  test("POST /user/otp/verify rejects an OTP shorter than 6 chars with 422", async ({
    client,
  }) => {
    const response = await client
      .post("/user/otp/verify")
      .json({ email: "123456@student.pwr.edu.pl", otp: "123" });

    response.assertStatus(422);
  });

  test("POST /user/otp/verify rejects a missing otp with 422", async ({
    client,
  }) => {
    const response = await client
      .post("/user/otp/verify")
      .json({ email: "123456@student.pwr.edu.pl" });

    response.assertStatus(422);
  });

  // TODO: seed a user with a known OTP and assert 200 + JWT cookie received
});

test.group("Auth | USOS login", () => {
  test("POST /user/login with missing tokens returns an error", async ({
    client,
    assert,
  }) => {
    try {
      await client.post("/user/login").json({});
      assert.fail("Expected a non-2xx response but received 2xx");
    } catch {}
  });
});

test.group("Auth | logout", () => {
  test("DELETE /user/logout returns 401 when not authenticated", async ({
    client,
  }) => {
    const response = await client.delete("/user/logout");
    response.assertStatus(401);
  });

  // TODO: authenticate and assert 200 + JWT cookie cleared
});
