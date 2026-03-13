import { test } from "@japa/runner";

import User from "#models/user";

import { createTestUser, generateBearerToken } from "./helpers.js";

test.group("Schedules | unauthenticated", () => {
  test("GET /user/schedules returns 401 without a token", async ({
    client,
  }) => {
    const response = await client.get("/user/schedules");
    response.assertStatus(401);
  });

  test("GET /user/schedules/:id returns 401 without a token", async ({
    client,
  }) => {
    const response = await client.get("/user/schedules/1");
    response.assertStatus(401);
  });

  test("POST /user/schedules returns 401 without a token", async ({
    client,
  }) => {
    const response = await client.post("/user/schedules").json({ name: "x" });
    response.assertStatus(401);
  });

  test("PATCH /user/schedules/:id returns 401 without a token", async ({
    client,
  }) => {
    const response = await client
      .patch("/user/schedules/1")
      .json({ name: "y" });
    response.assertStatus(401);
  });

  test("DELETE /user/schedules/:id returns 401 without a token", async ({
    client,
  }) => {
    const response = await client.delete("/user/schedules/1");
    response.assertStatus(401);
  });
});

test.group("Schedules | authenticated CRUD", (group) => {
  let user: User;
  let token: string;

  group.setup(async () => {
    user = await createTestUser({ studentNumber: `sched-crud-${Date.now()}` });
    token = generateBearerToken(user.id);
  });

  group.teardown(async () => {
    await user.delete();
  });

  test("GET /user/schedules returns 200 and an array", async ({
    client,
    assert,
  }) => {
    const response = await client.get("/user/schedules").bearerToken(token);

    response.assertStatus(200);
    assert.isArray(response.body());
  });

  test("POST /user/schedules creates a schedule and returns 200", async ({
    client,
    assert,
  }) => {
    const response = await client
      .post("/user/schedules")
      .bearerToken(token)
      .json({ name: "Test Schedule" });

    response.assertStatus(200);
    const body = response.body() as { schedule: { id: number; name: string } };
    assert.equal(body.schedule.name, "Test Schedule");
    assert.isNumber(body.schedule.id);
  });

  test("POST /user/schedules without name returns 422", async ({ client }) => {
    const response = await client
      .post("/user/schedules")
      .bearerToken(token)
      .json({});

    response.assertStatus(422);
  });

  test("PATCH /user/schedules/:id renames the schedule", async ({
    client,
    assert,
  }) => {
    const createRes = await client
      .post("/user/schedules")
      .bearerToken(token)
      .json({ name: "Original" });
    createRes.assertStatus(200);
    const scheduleId = (createRes.body() as { schedule: { id: number } })
      .schedule.id;

    const response = await client
      .patch(`/user/schedules/${scheduleId}`)
      .bearerToken(token)
      .json({ name: "Renamed" });

    response.assertStatus(200);
    const body = response.body() as { schedule: { name: string } };
    assert.equal(body.schedule.name, "Renamed");
  });

  test("DELETE /user/schedules/:id removes the schedule", async ({
    client,
    assert,
  }) => {
    const createRes = await client
      .post("/user/schedules")
      .bearerToken(token)
      .json({ name: "To Delete" });
    const scheduleId = (createRes.body() as { schedule: { id: number } })
      .schedule.id;

    const deleteRes = await client
      .delete(`/user/schedules/${scheduleId}`)
      .bearerToken(token);
    deleteRes.assertStatus(200);
    assert.equal((deleteRes.body() as { success: boolean }).success, true);

    const listRes = await client.get("/user/schedules").bearerToken(token);
    const ids = (listRes.body() as Array<{ id: number }>).map((s) => s.id);
    assert.notInclude(ids, scheduleId);
  });

  test("GET /user/schedules/:id returns 404 for another user's schedule", async ({
    client,
  }) => {
    const other = await createTestUser({
      studentNumber: `other-${Date.now()}`,
    });
    const otherToken = generateBearerToken(other.id);
    const createRes = await client
      .post("/user/schedules")
      .bearerToken(otherToken)
      .json({ name: "Other's Schedule" });
    const scheduleId = (createRes.body() as { schedule: { id: number } })
      .schedule.id;

    const response = await client
      .get(`/user/schedules/${scheduleId}`)
      .bearerToken(token);
    response.assertStatus(404);

    await other.delete();
  });

  test("PATCH /user/schedules/:id with invalid group id returns 422", async ({
    client,
  }) => {
    const createRes = await client
      .post("/user/schedules")
      .bearerToken(token)
      .json({ name: "Edge Case" });
    const scheduleId = (createRes.body() as { schedule: { id: number } })
      .schedule.id;

    const response = await client
      .patch(`/user/schedules/${scheduleId}`)
      .bearerToken(token)
      .json({ groups: [{ id: "not-a-number" }] });

    response.assertStatus(422);
  });

  test("POST /user/schedules with optional arrays stores relationships", async ({
    client,
    assert,
  }) => {
    const response = await client
      .post("/user/schedules")
      .bearerToken(token)
      .json({
        name: "With Arrays",
        groups: [],
        courses: [],
        registrations: [],
      });

    response.assertStatus(200);
    const body = response.body() as { schedule: { name: string } };
    assert.equal(body.schedule.name, "With Arrays");
  });
});
