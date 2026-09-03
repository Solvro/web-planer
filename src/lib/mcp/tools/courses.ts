import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";

import { getCourseEditionDetailsAction } from "@/actions/v2/get-course-edition-details";
import { getBatchCoursePreviewAction } from "@/actions/v2/get-course-editions-preview";
import { getPlannerCourseGroupsAction } from "@/actions/v2/get-course-groups-for-planner";
import { FACULTIES } from "@/actions/v2/get-faculties";
import { getFacultyRegistrationsAction } from "@/actions/v2/get-faculty-registrations";
import { getGroupSpotsAction } from "@/actions/v2/get-group-spots";
import { getLecturerAction } from "@/actions/v2/get-lecturer";
import { getRegistrationFacultyAction } from "@/actions/v2/get-registration-faculty";
import { getRegistrationRoundsAction } from "@/actions/v2/get-registration-rounds";
import { getRegistrationRoundCoursesAction } from "@/actions/v2/get-round-courses";

import { jsonResult } from "../json-result";

/**
 * Read-only USOS browsing tools, thin 1:1 wraps of `src/actions/v2/*` — the
 * same session-independent data the planner UI uses to let a user pick
 * courses and groups.
 */
export function registerCourseTools(server: McpServer): void {
  server.registerTool(
    "list_faculties",
    {
      description: "List university faculties available in the planner.",
      inputSchema: z.object({}),
    },
    () => jsonResult(FACULTIES),
  );

  server.registerTool(
    "list_faculty_registrations",
    {
      description:
        "List active course registrations for a faculty (a registration groups rounds a student can pick courses in).",
      inputSchema: z.object({ facultyId: z.string().trim() }),
    },
    async ({ facultyId }) =>
      jsonResult(await getFacultyRegistrationsAction(facultyId)),
  );

  server.registerTool(
    "get_registration_faculty",
    {
      description: "Get faculty/type details for one registration.",
      inputSchema: z.object({ registrationId: z.string().trim() }),
    },
    async ({ registrationId }) =>
      jsonResult(await getRegistrationFacultyAction(registrationId)),
  );

  server.registerTool(
    "list_registration_rounds",
    {
      description: "List registration rounds for a registration.",
      inputSchema: z.object({ registrationId: z.string().trim() }),
    },
    async ({ registrationId }) =>
      jsonResult(await getRegistrationRoundsAction(registrationId)),
  );

  server.registerTool(
    "list_round_courses",
    {
      description:
        "List courses available to sign up for in a registration round.",
      inputSchema: z.object({ roundId: z.string().trim() }),
    },
    async ({ roundId }) =>
      jsonResult(await getRegistrationRoundCoursesAction(roundId)),
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
    },
    async (input) => jsonResult(await getBatchCoursePreviewAction(input)),
  );

  server.registerTool(
    "get_course_details",
    {
      description: "Get a course edition's units/groups for a term.",
      inputSchema: z.object({
        courseId: z.string().trim(),
        termId: z.string().trim(),
      }),
    },
    async ({ courseId, termId }) =>
      jsonResult(await getCourseEditionDetailsAction(courseId, termId)),
  );

  server.registerTool(
    "get_course_groups",
    {
      description:
        "Get every group for a course in a term, each with its lecturers and weekly schedule pattern — the main tool for analyzing which group to place in a plan.",
      inputSchema: z.object({
        courseId: z.string().trim(),
        termId: z.string().trim(),
      }),
    },
    async ({ courseId, termId }) =>
      jsonResult(await getPlannerCourseGroupsAction(courseId, termId)),
  );

  server.registerTool(
    "get_group_spots",
    {
      description: "Get occupied/total spots for a specific class group.",
      inputSchema: z.object({
        unitId: z.string().trim(),
        groupNumber: z.string().trim(),
      }),
    },
    async ({ unitId, groupNumber }) =>
      jsonResult(await getGroupSpotsAction(unitId, groupNumber)),
  );

  server.registerTool(
    "get_lecturer",
    {
      description: "Get a lecturer's display info by their USOS user id.",
      inputSchema: z.object({ userId: z.string().trim() }),
    },
    async ({ userId }) => jsonResult(await getLecturerAction(userId)),
  );
}
