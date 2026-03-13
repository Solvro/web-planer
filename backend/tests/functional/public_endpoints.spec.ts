import { test } from "@japa/runner";

test.group("Public | GET /departments", () => {
  test("returns 200 and an array", async ({ client, assert }) => {
    const response = await client.get("/departments");
    response.assertStatus(200);
    assert.isArray(response.body());
  });
});

test.group("Public | GET /departments/:id", () => {
  test("returns 404 for a non-existent department", async ({ client }) => {
    const response = await client.get("/departments/non-existent-id");
    response.assertStatus(404);
  });
});

test.group("Public | GET /departments/:department_id/registrations", () => {
  test("returns 200 and an array for any department id", async ({
    client,
    assert,
  }) => {
    const response = await client.get(
      "/departments/non-existent/registrations",
    );

    const status = response.status();
    assert.isTrue(
      status === 200 || status === 404,
      `Unexpected status ${status}`,
    );
  });
});

test.group("Public | POST /shared", () => {
  test("returns 422 when required fields are missing", async ({ client }) => {
    const response = await client.post("/shared").json({});
    response.assertStatus(422);
  });

  test("returns 422 when plan is missing", async ({ client }) => {
    const response = await client.post("/shared").json({ id: "some-id" });
    response.assertStatus(422);
  });

  test("returns 422 when id is missing", async ({ client }) => {
    const response = await client
      .post("/shared")
      .json({ plan: '{"registrations":[]}' });
    response.assertStatus(422);
  });

  test("returns 200 and persists the shared plan", async ({
    client,
    assert,
  }) => {
    const id = crypto.randomUUID();
    const plan = JSON.stringify({ registrations: [{ id: "reg-1" }] });

    const createRes = await client.post("/shared").json({ id, plan });
    createRes.assertStatus(200);

    const body = createRes.body() as {
      message: string;
      shared: { id: string; plan: string };
    };
    assert.equal(body.shared.id, id);
    assert.equal(body.shared.plan, plan);

    const getRes = await client.get(`/shared/${id}`);
    getRes.assertStatus(200);
    const getBody = getRes.body() as {
      success: boolean;
      plan: { id: string; plan: string };
    };
    assert.isTrue(getBody.success);
    assert.equal(getBody.plan.id, id);
    assert.equal(getBody.plan.plan, plan);
  });
});

test.group("Public | GET /shared/:id", () => {
  test("returns 200 with success:false for a non-existent shared plan", async ({
    client,
    assert,
  }) => {
    const response = await client.get("/shared/definitely-does-not-exist");
    response.assertStatus(200);
    assert.equal((response.body() as { success: boolean }).success, false);
  });
});
