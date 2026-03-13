import { test } from "@japa/runner";

import { createDepartmentValidator } from "#validators/department";

const validDepartment = {
  id: "dept-w4",
  name: "Wydział Informatyki i Telekomunikacji",
  url: "https://wit.pwr.edu.pl",
};

test.group("Validator | createDepartment", () => {
  test("accepts a valid department payload", async ({ assert }) => {
    await assert.doesNotReject(() =>
      createDepartmentValidator.validate(validDepartment),
    );
  });

  test("rejects when id is missing", async ({ assert }) => {
    const { id: _id, ...withoutId } = validDepartment;
    await assert.rejects(() =>
      createDepartmentValidator.validate(withoutId as any),
    );
  });

  test("rejects when name is missing", async ({ assert }) => {
    const { name: _name, ...withoutName } = validDepartment;
    await assert.rejects(() =>
      createDepartmentValidator.validate(withoutName as any),
    );
  });

  test("rejects when url is missing", async ({ assert }) => {
    const { url: _url, ...withoutUrl } = validDepartment;
    await assert.rejects(() =>
      createDepartmentValidator.validate(withoutUrl as any),
    );
  });

  test("rejects an empty object", async ({ assert }) => {
    await assert.rejects(() => createDepartmentValidator.validate({} as any));
  });
});
