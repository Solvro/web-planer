import { test } from "@japa/runner";

import { createGroupValidator } from "#validators/group";

const validGroup = {
  id: 1,
  name: "K01-12a",
  startTime: "08:00:00",
  endTime: "09:30:00",
  group: "1",
  lecturer: "Jan Kowalski",
  week: "-" as const,
  type: "LAB",
  day: "Poniedziałek",
  courseId: "course-001",
  url: "https://example.com",
};

test.group("Validator | createGroup", () => {
  test("accepts a fully valid group payload", async ({ assert }) => {
    await assert.doesNotReject(() => createGroupValidator.validate(validGroup));
  });

  test("accepts all valid week enum values", async ({ assert }) => {
    for (const week of ["-", "TP", "TN"] as const) {
      await assert.doesNotReject(() =>
        createGroupValidator.validate({ ...validGroup, week }),
      );
    }
  });

  test("rejects an invalid week value", async ({ assert }) => {
    await assert.rejects(() =>
      createGroupValidator.validate({ ...validGroup, week: "XX" as any }),
    );
  });

  test("rejects a startTime without seconds", async ({ assert }) => {
    await assert.rejects(() =>
      createGroupValidator.validate({ ...validGroup, startTime: "08:00" }),
    );
  });

  test("rejects an invalid startTime format", async ({ assert }) => {
    await assert.rejects(() =>
      createGroupValidator.validate({
        ...validGroup,
        startTime: "25:00:00",
      }),
    );
  });

  test("rejects a startTime with letters", async ({ assert }) => {
    await assert.rejects(() =>
      createGroupValidator.validate({
        ...validGroup,
        startTime: "ab:cd:ef",
      }),
    );
  });

  test("rejects when required fields are missing", async ({ assert }) => {
    const { name: _name, ...withoutName } = validGroup;
    await assert.rejects(() =>
      createGroupValidator.validate(withoutName as any),
    );
  });

  test("rejects when id is not a number", async ({ assert }) => {
    await assert.rejects(() =>
      createGroupValidator.validate({ ...validGroup, id: "abc" as any }),
    );
  });
});
