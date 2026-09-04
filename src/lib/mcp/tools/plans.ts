import type { McpServer, ServerContext } from "@modelcontextprotocol/server";
import * as z from "zod";

import { env } from "@/env.mjs";
import {
  RegistrationUnavailableError,
  fetchRegistrationCourses,
  fetchRegistrationDetails,
} from "@/lib/plan/build-registration-courses";
import * as planStore from "@/lib/plan/store";
import type { ExtendedCourse, OnlinePlan } from "@/types";

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

async function buildSharedSnapshot(plan: OnlinePlan) {
  const courseIds = new Set(plan.courses.map((course) => course.id));
  const groupIds = new Set(plan.groups.map((group) => group.id));

  const [registrations, coursesByRegistration] = await Promise.all([
    Promise.all(
      plan.registrations.map(async ({ id }) => fetchRegistrationDetails(id)),
    ),
    Promise.all(
      plan.registrations.map(async ({ id }) => fetchRegistrationCourses(id)),
    ),
  ]);

  const courses: ExtendedCourse[] = coursesByRegistration
    .flat()
    .filter((course) => courseIds.has(course.id))
    .map((course) => ({
      ...course,
      isChecked: true,
      groups: course.groups.map((group) => ({
        ...group,
        isChecked: groupIds.has(group.groupOnlineId),
      })),
    }));

  return {
    name: plan.name,
    courses,
    registrations,
    allGroups: courses.flatMap((course) => course.groups),
  };
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
        "Add a course to a plan (idempotent — adding an already-selected id just re-affirms it). The course only shows as selected in the web UI once the plan also has the matching registration via add_registration_to_plan.",
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
        "Select a class group (a specific lecture/lab/etc. slot) into a plan. groupId must be the `groupOnlineId` returned by get_course_groups — not a raw unitId — or the web UI won't recognize it as selected.",
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
      description:
        "Deselect a class group from a plan. groupId is the `groupOnlineId` from get_course_groups.",
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
      description:
        "Add a registration to track in a plan. Required for any of that registration's courses to show as selected in the web UI, even if add_course_to_plan was already called for them.",
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

  server.registerTool(
    "share_plan",
    {
      description:
        "Publish a plan's current selection as a public, read-only link anyone can open — no login required. Re-sharing an already-shared plan refreshes the snapshot to match its current selection.",
      inputSchema: z.object({ planId: z.string().trim() }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ planId }, context) => {
      const userId = requireUserId(context);
      const plan = await planStore.getPlan(userId, planId);
      if (plan === null) {
        return planNotFound();
      }
      let snapshot;
      try {
        snapshot = await buildSharedSnapshot(plan);
      } catch (error) {
        return errorResult(
          error instanceof RegistrationUnavailableError
            ? error.message
            : "Nie udało się przygotować planu do udostępnienia",
        );
      }
      const updated = await planStore.sharePlan(userId, planId, snapshot);
      return updated === null
        ? planNotFound()
        : jsonResult({
            url: `${env.SITE_URL}/plans/preview/${planId}`,
            updatedAt: updated.updatedAt,
          });
    },
  );

  server.registerTool(
    "unshare_plan",
    {
      description: "Disable a plan's public share link.",
      inputSchema: z.object({ planId: z.string().trim() }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ planId }, context) => {
      const updated = await planStore.unsharePlan(
        requireUserId(context),
        planId,
      );
      return updated === null ? planNotFound() : jsonResult(updated);
    },
  );
}
