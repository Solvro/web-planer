import { test } from "@japa/runner";

import { createCourseValidator } from "#validators/course";

const validCourse = {
  id: "course-001",
  name: "Matematyka dyskretna",
  registrationId: "reg-001",
};

test.group("Validator | createCourse", () => {
  test("accepts a valid course payload", async ({ assert }) => {
    await assert.doesNotReject(() =>
      createCourseValidator.validate(validCourse),
    );
  });

  test("rejects when id is missing", async ({ assert }) => {
    const { id: _id, ...withoutId } = validCourse;
    await assert.rejects(() =>
      createCourseValidator.validate(withoutId as any),
    );
  });

  test("rejects when name is missing", async ({ assert }) => {
    const { name: _name, ...withoutName } = validCourse;
    await assert.rejects(() =>
      createCourseValidator.validate(withoutName as any),
    );
  });

  test("rejects when registrationId is missing", async ({ assert }) => {
    const { registrationId: _regId, ...withoutRegId } = validCourse;
    await assert.rejects(() =>
      createCourseValidator.validate(withoutRegId as any),
    );
  });

  test("rejects an empty object", async ({ assert }) => {
    await assert.rejects(() => createCourseValidator.validate({} as any));
  });
});
