import type { McpServer, ServerContext } from "@modelcontextprotocol/server";
import * as z from "zod";

import * as planStore from "@/lib/plan/store";

import { userIdFromAuthInfo } from "../auth-info";
import { errorResult, jsonResult } from "../json-result";

const requireUserId = (context: ServerContext) =>
  userIdFromAuthInfo(context.http?.authInfo);

function withoutId(items: { id: string }[], id: string) {
  return items.filter((item) => item.id !== id);
}

function withId(items: { id: string }[], id: string) {
  return [...withoutId(items, id), { id }];
}

async function updateSelection(
  userId: string,
  planId: string,
  key: "courses" | "groups" | "registrations",
  items: { id: string }[],
) {
  const plan = await planStore.getPlan(userId, planId);
  if (plan === null) {
    return null;
  }
  return planStore.updatePlan(userId, planId, {
    name: plan.name,
    courses: plan.courses,
    groups: plan.groups,
    registrations: plan.registrations,
    [key]: items,
  } satisfies planStore.PlanPayload);
}

function planNotFound() {
  return errorResult("Nie znaleziono planu");
}

export function registerPlanTools(server: McpServer): void {
  server.registerTool(
    "list_plans",
    {
      description: "List the current user's saved plans.",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async (_arguments: unknown, context: ServerContext) =>
      jsonResult(await planStore.listPlans(requireUserId(context))),
  );

  server.registerTool(
    "get_plan",
    {
      description:
        "Get one plan's full contents: its selected course, group and registration ids.",
      inputSchema: z.object({ planId: z.string().trim() }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ planId }, context) => {
      const plan = await planStore.getPlan(requireUserId(context), planId);
      return plan === null ? planNotFound() : jsonResult(plan);
    },
  );

  server.registerTool(
    "create_plan",
    {
      description: "Create a new, empty plan owned by the current user.",
      inputSchema: z.object({ name: z.string().trim().min(1) }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ name }, context) =>
      jsonResult(
        await planStore.createPlan(requireUserId(context), {
          id: crypto.randomUUID(),
          name,
          courses: [],
          groups: [],
          registrations: [],
        }),
      ),
  );

  server.registerTool(
    "rename_plan",
    {
      description: "Rename an existing plan.",
      inputSchema: z.object({
        planId: z.string().trim(),
        name: z.string().trim().min(1),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ planId, name }, context) => {
      const userId = requireUserId(context);
      const plan = await planStore.getPlan(userId, planId);
      if (plan === null) {
        return planNotFound();
      }
      const updated = await planStore.updatePlan(userId, planId, {
        name,
        courses: plan.courses,
        groups: plan.groups,
        registrations: plan.registrations,
      });
      return updated === null ? planNotFound() : jsonResult(updated);
    },
  );

  server.registerTool(
    "delete_plan",
    {
      description: "Permanently delete a plan.",
      inputSchema: z.object({ planId: z.string().trim() }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ planId }, context) => {
      const deleted = await planStore.deletePlan(
        requireUserId(context),
        planId,
      );
      return deleted ? jsonResult({ deleted: true }) : planNotFound();
    },
  );

  server.registerTool(
    "add_course_to_plan",
    {
      description:
        "Add a course to a plan (idempotent — adding an already-selected id just re-affirms it).",
      inputSchema: z.object({
        planId: z.string().trim(),
        courseId: z.string().trim(),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ planId, courseId }, context) => {
      const userId = requireUserId(context);
      const plan = await planStore.getPlan(userId, planId);
      if (plan === null) {
        return planNotFound();
      }
      const updated = await updateSelection(
        userId,
        planId,
        "courses",
        withId(plan.courses, courseId),
      );
      return updated === null ? planNotFound() : jsonResult(updated);
    },
  );

  server.registerTool(
    "remove_course_from_plan",
    {
      description: "Remove a course from a plan.",
      inputSchema: z.object({
        planId: z.string().trim(),
        courseId: z.string().trim(),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ planId, courseId }, context) => {
      const userId = requireUserId(context);
      const plan = await planStore.getPlan(userId, planId);
      if (plan === null) {
        return planNotFound();
      }
      const updated = await updateSelection(
        userId,
        planId,
        "courses",
        withoutId(plan.courses, courseId),
      );
      return updated === null ? planNotFound() : jsonResult(updated);
    },
  );

  server.registerTool(
    "add_group_to_plan",
    {
      description:
        "Select a class group (a specific lecture/lab/etc. slot, identified by its unit id) into a plan.",
      inputSchema: z.object({
        planId: z.string().trim(),
        groupId: z.string().trim(),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ planId, groupId }, context) => {
      const userId = requireUserId(context);
      const plan = await planStore.getPlan(userId, planId);
      if (plan === null) {
        return planNotFound();
      }
      const updated = await updateSelection(
        userId,
        planId,
        "groups",
        withId(plan.groups, groupId),
      );
      return updated === null ? planNotFound() : jsonResult(updated);
    },
  );

  server.registerTool(
    "remove_group_from_plan",
    {
      description: "Deselect a class group from a plan.",
      inputSchema: z.object({
        planId: z.string().trim(),
        groupId: z.string().trim(),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ planId, groupId }, context) => {
      const userId = requireUserId(context);
      const plan = await planStore.getPlan(userId, planId);
      if (plan === null) {
        return planNotFound();
      }
      const updated = await updateSelection(
        userId,
        planId,
        "groups",
        withoutId(plan.groups, groupId),
      );
      return updated === null ? planNotFound() : jsonResult(updated);
    },
  );

  server.registerTool(
    "add_registration_to_plan",
    {
      description: "Add a registration to track in a plan.",
      inputSchema: z.object({
        planId: z.string().trim(),
        registrationId: z.string().trim(),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ planId, registrationId }, context) => {
      const userId = requireUserId(context);
      const plan = await planStore.getPlan(userId, planId);
      if (plan === null) {
        return planNotFound();
      }
      const updated = await updateSelection(
        userId,
        planId,
        "registrations",
        withId(plan.registrations, registrationId),
      );
      return updated === null ? planNotFound() : jsonResult(updated);
    },
  );

  server.registerTool(
    "remove_registration_from_plan",
    {
      description: "Remove a registration from a plan.",
      inputSchema: z.object({
        planId: z.string().trim(),
        registrationId: z.string().trim(),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ planId, registrationId }, context) => {
      const userId = requireUserId(context);
      const plan = await planStore.getPlan(userId, planId);
      if (plan === null) {
        return planNotFound();
      }
      const updated = await updateSelection(
        userId,
        planId,
        "registrations",
        withoutId(plan.registrations, registrationId),
      );
      return updated === null ? planNotFound() : jsonResult(updated);
    },
  );
}
