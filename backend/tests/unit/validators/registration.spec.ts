import { test } from "@japa/runner";

import { createRegistrationValidator } from "#validators/registration";

const validRegistration = {
  id: "reg-001",
  name: "Rejestracja letnia 2026",
  departmentId: "dept-01",
  round: 1,
};

test.group("Validator | createRegistration", () => {
  test("accepts a valid registration payload", async ({ assert }) => {
    await assert.doesNotReject(() =>
      createRegistrationValidator.validate(validRegistration),
    );
  });

  test("rejects when id is missing", async ({ assert }) => {
    const { id: _id, ...withoutId } = validRegistration;
    await assert.rejects(() =>
      createRegistrationValidator.validate(withoutId as any),
    );
  });

  test("rejects when name is missing", async ({ assert }) => {
    const { name: _name, ...withoutName } = validRegistration;
    await assert.rejects(() =>
      createRegistrationValidator.validate(withoutName as any),
    );
  });

  test("rejects when departmentId is missing", async ({ assert }) => {
    const { departmentId: _deptId, ...withoutDeptId } = validRegistration;
    await assert.rejects(() =>
      createRegistrationValidator.validate(withoutDeptId as any),
    );
  });

  test("rejects when round is missing", async ({ assert }) => {
    const { round: _round, ...withoutRound } = validRegistration;
    await assert.rejects(() =>
      createRegistrationValidator.validate(withoutRound as any),
    );
  });

  test("rejects when round is not a number", async ({ assert }) => {
    await assert.rejects(() =>
      createRegistrationValidator.validate({
        ...validRegistration,
        round: "first" as any,
      }),
    );
  });

  test("rejects an empty object", async ({ assert }) => {
    await assert.rejects(() => createRegistrationValidator.validate({} as any));
  });
});
