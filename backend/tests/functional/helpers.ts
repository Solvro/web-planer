import jwt from "jsonwebtoken";

import db from "@adonisjs/lucid/services/db";

import User from "#models/user";

/**
 * Helper: truncate all non-migration tables so each test run starts clean.
 *
 * Call this in your suite's global setup (e.g. bootstrap.ts) or in
 * individual `group.setup` hooks that need a pristine database.
 */
export async function cleanDb(): Promise<void> {
  const tables = await db.rawQuery<{ rows: Array<{ tablename: string }> }>(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
  );
  for (const { tablename } of tables.rows) {
    if (
      tablename !== "adonis_schema" &&
      tablename !== "adonis_schema_versions"
    ) {
      await db.rawQuery(
        `TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE`,
      );
    }
  }
}

/**
 * Helper: create a verified test user.
 *
 * Requires the functional suite (httpServer running) and a working DB.
 * Delete the returned user in test teardown to keep the DB clean.
 */
export async function createTestUser(
  overrides: Partial<{
    studentNumber: string;
    firstName: string;
    lastName: string;
    usosId: string;
    verified: boolean;
  }> = {},
): Promise<User> {
  return User.create({
    studentNumber: overrides.studentNumber ?? `test-${Date.now()}`,
    firstName: overrides.firstName ?? "Test",
    lastName: overrides.lastName ?? "User",
    usosId: overrides.usosId ?? "",
    avatar: null,
    verified: overrides.verified ?? true,
  });
}

/**
 * Helper: generate a signed Bearer token for a given user.
 *
 * The JWT is signed with the APP_KEY, matching exactly what the
 * `@maximemrf/adonisjs-jwt` guard uses internally. Pass the returned
 * token to `client.bearerToken(token)` in functional test specs.
 */
export function generateBearerToken(userId: number): string {
  const appKey = process.env["APP_KEY"];
  if (!appKey) {
    throw new Error("APP_KEY environment variable is not set");
  }
  return jwt.sign({ userId }, appKey, { expiresIn: 60 * 60 });
}
