import { test } from "@japa/runner";

import { createSharedValidator } from "#validators/shared";

test.group("Validator | createShared", () => {
  test("accepts a valid payload", async ({ assert }) => {
    await assert.doesNotReject(() =>
      createSharedValidator.validate({
        id: "share-abc-123",
        plan: '{"some":"plan"}',
      }),
    );
  });

  test("rejects when id is missing", async ({ assert }) => {
    await assert.rejects(() =>
      createSharedValidator.validate({ plan: '{"some":"plan"}' } as any),
    );
  });

  test("rejects when plan is missing", async ({ assert }) => {
    await assert.rejects(() =>
      createSharedValidator.validate({ id: "share-abc-123" } as any),
    );
  });

  test("rejects an empty object", async ({ assert }) => {
    await assert.rejects(() => createSharedValidator.validate({} as any));
  });

  test("rejects when id is not a string", async ({ assert }) => {
    await assert.rejects(() =>
      createSharedValidator.validate({ id: 42 as any, plan: "data" }),
    );
  });
});
