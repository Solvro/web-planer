import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";
import { createHash } from "node:crypto";

interface UsosCourseEdition {
  start_time?: string | null;
  end_time?: string | null;
  name?: { pl?: string; en?: string } | null;
  type?: string | null;
  group_number?: string | null;
  lecturer_ids?: string[] | null;
  classtype_name?: { pl?: string; en?: string } | null;
}

export interface CoursePreviewDTO {
  id: string;
  startTime: string;
  endTime: string;
  name: string;
  type: string;
  groupNumber: string;
  lecturerIds: string[];
  classTypeName: string;
}

interface BatchCoursePreviewParameters {
  courseEditionIds: string[];
  termId: string;
  start: string;
  days: number;
}

export async function getBatchCoursePreviewAction(
  parameters: BatchCoursePreviewParameters,
): Promise<Record<string, CoursePreviewDTO[]>> {
  const { courseEditionIds, termId, start, days } = parameters;

  if (courseEditionIds.length === 0) {
    return {};
  }

  const sortedIds = [...courseEditionIds].toSorted().join(",");
  const daysString = days.toString();
  const hash = createHash("sha256")
    .update(`${sortedIds}-${termId}-${start}-${daysString}`)
    .digest("hex");

  return getOrSetRedis({
    redis,
    key: `usos:course_editions:${hash}`,
    ttlSeconds: 60 * 60 * 12,
    fetcher: async () => {
      const response = await fetchUsosApi<Record<string, UsosCourseEdition[]>>(
        "tt/course_editions",
        {
          course_edition_ids: courseEditionIds.join(","),
          term_id: termId,
          start,
          days: daysString,
          fields:
            "start_time|end_time|name|type|group_number|lecturer_ids|classtype_name",
        },
      );

      if (response == null) {
        return {};
      }

      const normalizedData: Record<string, CoursePreviewDTO[]> = {};

      for (const [editionId, events] of Object.entries(response)) {
        if (!Array.isArray(events)) {
          continue;
        }

        const mapped = events.map((event) => ({
          id: editionId,
          startTime: event.start_time ?? "",
          endTime: event.end_time ?? "",
          name: event.name?.pl ?? event.name?.en ?? "",
          type: event.type ?? "",
          groupNumber: event.group_number ?? "",
          lecturerIds: event.lecturer_ids ?? [],
          classTypeName:
            event.classtype_name?.pl ?? event.classtype_name?.en ?? "",
        }));

        mapped.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        );

        normalizedData[editionId] = mapped;
      }

      return normalizedData;
    },
  });
}
