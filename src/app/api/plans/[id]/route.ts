import type { NextRequest } from "next/server";

import { getSession } from "@/lib/get-session";
import * as planStore from "@/lib/plan/store";

interface ResolvedGroup {
  courseId: string;
  unitId: string;
  groupNumber: string;
  classtypeId: string;
}

const GROUP_ID_SEPARATOR = "_group_";

function parseGroupId(id: string) {
  const separatorIndex = id.lastIndexOf(GROUP_ID_SEPARATOR);
  if (separatorIndex === -1) {
    return null;
  }
  const index = Number.parseInt(
    id.slice(separatorIndex + GROUP_ID_SEPARATOR.length),
  );
  return Number.isNaN(index)
    ? null
    : { courseId: id.slice(0, separatorIndex), index };
}

async function resolveGroups(
  groupIds: string[],
  termId: string,
  courseFilter: string | null,
): Promise<ResolvedGroup[]> {
  const indexesByCourse = new Map<string, number[]>();
  for (const id of groupIds) {
    const parsed = parseGroupId(id);
    if (
      parsed === null ||
      (courseFilter !== null && parsed.courseId !== courseFilter)
    ) {
      continue;
    }
    indexesByCourse.set(parsed.courseId, [
      ...(indexesByCourse.get(parsed.courseId) ?? []),
      parsed.index,
    ]);
  }

  const { getCourseEditionDetailsAction } =
    await import("@/actions/v2/get-course-edition-details");

  const resolved = await Promise.all(
    [...indexesByCourse].map(async ([courseId, indexes]) => {
      try {
        const { groups } = await getCourseEditionDetailsAction(
          courseId,
          termId,
        );
        return indexes.flatMap((index) => {
          const group = groups.at(index);
          return group === undefined ? [] : [{ ...group, courseId }];
        });
      } catch (error) {
        console.error(`Failed to resolve groups for ${courseId}`, error);
        return [];
      }
    }),
  );

  return resolved
    .flat()
    .map(({ courseId, unitId, groupNumber, classtypeId }) => ({
      courseId,
      unitId,
      groupNumber,
      classtypeId,
    }));
}

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/plans/[id]">,
) {
  const session = await getSession();
  if (session == null) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const plan = await planStore.getPlan(session.user.id, id);
  if (plan === null) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const termId = request.nextUrl.searchParams.get("termId");
  const courseFilter = request.nextUrl.searchParams.get("courseId");
  const groupIds = plan.groups.map((group) => group.id);

  return Response.json({
    id: plan.id,
    name: plan.name,
    updatedAt: plan.updatedAt,
    registrations: plan.registrations.map((registration) => registration.id),
    courses: [
      ...new Set([
        ...plan.courses.map((course) => course.id),
        ...groupIds.flatMap((groupId) => parseGroupId(groupId)?.courseId ?? []),
      ]),
    ],
    groups:
      termId === null
        ? []
        : await resolveGroups(groupIds, termId, courseFilter),
  });
}
