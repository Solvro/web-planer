import { test } from "@japa/runner";

import { createUserValidator } from "#validators/user";

test.group("Validator | createUser (update profile)", () => {
  test("accepts an empty object (all fields optional)", async ({ assert }) => {
    await assert.doesNotReject(() => createUserValidator.validate({}));
  });

  test("accepts a full valid payload", async ({ assert }) => {
    await assert.doesNotReject(() =>
      createUserValidator.validate({
        allowNotifications: true,
        avatar: "https://example.com/avatar.png",
        firstName: "Jan",
        lastName: "Kowalski",
      }),
    );
  });

  test("accepts allowNotifications as false", async ({ assert }) => {
    await assert.doesNotReject(() =>
      createUserValidator.validate({ allowNotifications: false }),
    );
  });

  test("rejects when allowNotifications is not a boolean", async ({
    assert,
  }) => {
    await assert.rejects(() =>
      createUserValidator.validate({ allowNotifications: "yes" as any }),
    );
  });

  test("accepts partial payload with only firstName", async ({ assert }) => {
    await assert.doesNotReject(() =>
      createUserValidator.validate({ firstName: "Anna" }),
    );
  });
});
