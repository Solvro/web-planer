import type { McpServer, ToolAnnotations } from "@modelcontextprotocol/server";
import * as z from "zod";

import { FACULTIES } from "@/actions/v2/get-faculties";

import { jsonResult } from "../json-result";

const READ_ONLY: ToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
};

export function registerCourseTools(server: McpServer): void {
  server.registerTool(
    "list_faculties",
    {
      description: "List university faculties available in the planner.",
      inputSchema: z.object({}),
      annotations: READ_ONLY,
    },
    () => jsonResult(FACULTIES),
  );

  server.registerTool(
    "list_faculty_registrations",
    {
      description:
        "List active course registrations for a faculty (a registration groups rounds a student can pick courses in).",
      inputSchema: z.object({ facultyId: z.string().trim() }),
      annotations: READ_ONLY,
    },
    async ({ facultyId }) => {
      const { getFacultyRegistrationsAction } =
        await import("@/actions/v2/get-faculty-registrations");
      return jsonResult(await getFacultyRegistrationsAction(facultyId));
    },
  );

  server.registerTool(
    "get_registration_faculty",
    {
      description: "Get faculty/type details for one registration.",
      inputSchema: z.object({ registrationId: z.string().trim() }),
      annotations: READ_ONLY,
    },
    async ({ registrationId }) => {
      const { getRegistrationFacultyAction } =
        await import("@/actions/v2/get-registration-faculty");
      return jsonResult(await getRegistrationFacultyAction(registrationId));
    },
  );

  server.registerTool(
    "list_registration_rounds",
    {
      description: "List registration rounds for a registration.",
      inputSchema: z.object({ registrationId: z.string().trim() }),
      annotations: READ_ONLY,
    },
    async ({ registrationId }) => {
      const { getRegistrationRoundsAction } =
        await import("@/actions/v2/get-registration-rounds");
      return jsonResult(await getRegistrationRoundsAction(registrationId));
    },
  );

  server.registerTool(
    "list_round_courses",
    {
      description:
        "List courses available to sign up for in a registration round.",
      inputSchema: z.object({ roundId: z.string().trim() }),
      annotations: READ_ONLY,
    },
    async ({ roundId }) => {
      const { getRegistrationRoundCoursesAction } =
        await import("@/actions/v2/get-round-courses");
      return jsonResult(await getRegistrationRoundCoursesAction(roundId));
    },
  );

  server.registerTool(
    "preview_courses",
    {
      description:
        "Batch preview of course edition meeting slots within a date window, for quickly checking overlaps before adding courses to a plan.",
      inputSchema: z.object({
        courseEditionIds: z.array(z.string().trim()),
        termId: z.string().trim(),
        start: z.string().trim(),
        days: z.int().positive(),
      }),
      annotations: READ_ONLY,
    },
    async (input) => {
      const { getBatchCoursePreviewAction } =
        await import("@/actions/v2/get-course-editions-preview");
      return jsonResult(await getBatchCoursePreviewAction(input));
    },
  );

  server.registerTool(
    "get_course_details",
    {
      description: "Get a course edition's units/groups for a term.",
      inputSchema: z.object({
        courseId: z.string().trim(),
        termId: z.string().trim(),
      }),
      annotations: READ_ONLY,
    },
    async ({ courseId, termId }) => {
      const { getCourseEditionDetailsAction } =
        await import("@/actions/v2/get-course-edition-details");
      return jsonResult(await getCourseEditionDetailsAction(courseId, termId));
    },
  );

  server.registerTool(
    "get_course_groups",
    {
      description:
        "Get every group for a course in a term, each with its lecturers and weekly schedule pattern — the main tool for analyzing which group to place in a plan. Each group's `groupOnlineId` is the id add_group_to_plan/remove_group_from_plan expect, not `unitId`.",
      inputSchema: z.object({
        courseId: z.string().trim(),
        termId: z.string().trim(),
      }),
      annotations: READ_ONLY,
    },
    async ({ courseId, termId }) => {
      const { getPlannerCourseGroupsAction } =
        await import("@/actions/v2/get-course-groups-for-planner");
      const groups = await getPlannerCourseGroupsAction(courseId, termId);
      return jsonResult(
        groups.map((group, index) => ({
          ...group,
          groupOnlineId: `${courseId}_group_${index.toString()}`,
        })),
      );
    },
  );

  server.registerTool(
    "get_group_spots",
    {
      description: "Get occupied/total spots for a specific class group.",
      inputSchema: z.object({
        unitId: z.string().trim(),
        groupNumber: z.string().trim(),
      }),
      annotations: READ_ONLY,
    },
    async ({ unitId, groupNumber }) => {
      const { getGroupSpotsAction } =
        await import("@/actions/v2/get-group-spots");
      return jsonResult(await getGroupSpotsAction(unitId, groupNumber));
    },
  );

  server.registerTool(
    "get_lecturer",
    {
      description: "Get a lecturer's display info by their USOS user id.",
      inputSchema: z.object({ userId: z.string().trim() }),
      annotations: READ_ONLY,
    },
    async ({ userId }) => {
      const { getLecturerAction } = await import("@/actions/v2/get-lecturer");
      return jsonResult(await getLecturerAction(userId));
    },
  );
}
