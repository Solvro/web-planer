import { NextResponse } from "next/server";

import { fetchRegistrationCourses } from "@/lib/plan/build-registration-courses";
import { getCalendarPlan } from "@/lib/plan/store";
import { buildIcs } from "@/lib/utils/generate-ics-file";
import type { CalendarGroup } from "@/lib/utils/generate-ics-file";

async function loadScheduleGroups(
  scheduleId: string,
): Promise<CalendarGroup[]> {
  const result: CalendarGroup[] = [];

  const schedule = await getCalendarPlan(scheduleId);

  if (schedule === null) {
    return [];
  }

  for (const registrationId of schedule.registrations) {
    const allCourseData = await fetchRegistrationCourses(registrationId.id);

    for (const course of allCourseData) {
      for (const group of course.groups) {
        if (schedule.groups.some((g) => g.id === group.groupOnlineId)) {
          result.push({
            id: group.groupId,
            groupNumber: group.groupNumber,
            lecturer: group.lecturer,
            dates: group.dates ?? [],
            startTime: group.startTime,
            endTime: group.endTime,
            courseName: group.courseName,
            courseType: group.courseType,
          });
        }
      }
    }
  }

  return result;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!filename.includes(".ics") || filename.length <= 4) {
    return new NextResponse("", {
      status: 400,
    });
  }

  const scheduleId = filename.replace(".ics", "");

  const groupsForSaving: CalendarGroup[] = await loadScheduleGroups(scheduleId);

  const icsContent = buildIcs(groupsForSaving);

  return new NextResponse(icsContent.content, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
