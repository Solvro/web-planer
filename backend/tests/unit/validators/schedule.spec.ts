import { test } from "@japa/runner";

import {
  createScheduleValidator,
  updateScheduleValidator,
} from "#validators/schedule";

test.group("Validator | createSchedule", () => {
  test("accepts a valid payload with only a name", async ({ assert }) => {
    await assert.doesNotReject(() =>
      createScheduleValidator.validate({ name: "My Schedule" }),
    );
  });

  test("accepts a payload with groups, courses and registrations", async ({
    assert,
  }) => {
    await assert.doesNotReject(() =>
      createScheduleValidator.validate({
        name: "Full Schedule",
        groups: [{ id: 1 }, { id: 2 }],
        courses: [{ id: "course-abc" }],
        registrations: [{ id: "reg-xyz" }],
      }),
    );
  });

  test("accepts a payload with empty optional arrays", async ({ assert }) => {
    await assert.doesNotReject(() =>
      createScheduleValidator.validate({
        name: "Empty Arrays",
        groups: [],
        courses: [],
        registrations: [],
      }),
    );
  });

  test("rejects when name is missing", async ({ assert }) => {
    await assert.rejects(() => createScheduleValidator.validate({} as any));
  });

  test("rejects when a group id is not a number", async ({ assert }) => {
    await assert.rejects(() =>
      createScheduleValidator.validate({
        name: "Bad Group",
        groups: [{ id: "not-a-number" as any }],
      }),
    );
  });

  test("rejects when a course id is not a string", async ({ assert }) => {
    await assert.rejects(() =>
      createScheduleValidator.validate({
        name: "Bad Course",
        courses: [{ id: 123 as any }],
      }),
    );
  });
});

test.group("Validator | updateSchedule", () => {
  test("accepts an empty object (all fields optional)", async ({ assert }) => {
    await assert.doesNotReject(() => updateScheduleValidator.validate({}));
  });

  test("accepts a partial payload with only name", async ({ assert }) => {
    await assert.doesNotReject(() =>
      updateScheduleValidator.validate({ name: "Renamed" }),
    );
  });

  test("accepts a full update payload", async ({ assert }) => {
    await assert.doesNotReject(() =>
      updateScheduleValidator.validate({
        name: "Updated",
        sharedId: "share-123",
        groups: [{ id: 5 }],
        courses: [{ id: "c1" }],
        registrations: [{ id: "r1" }],
        updatedAt: "2026-01-01T00:00:00.000Z",
      }),
    );
  });

  test("rejects when a group id is not a number", async ({ assert }) => {
    await assert.rejects(() =>
      updateScheduleValidator.validate({
        groups: [{ id: "abc" as any }],
      }),
    );
  });
});
