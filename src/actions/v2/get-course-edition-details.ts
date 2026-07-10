"use server";

import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";

//todo: w api usos nie ma czegos takiego jak lecturer ids dla tego endpointu (albo cos pojebalem), wiec trzeba to poprawic bo obecnie to jest chyba undefined

interface UsosCourseEdition {
  course_id: string;
  term_id: string;
  course_units_ids: string[] | null;
}

interface UsosCourseUnitGroup {
  course_unit_id: string;
  group_number: number;
  lecturer_ids: string[] | null;
}

interface UsosCourseUnit {
  id: string;
  classtype_id: string;
  groups: UsosCourseUnitGroup[] | null;
}

export interface CourseGroupDTO {
  unitId: string;
  groupNumber: string;
  classtypeId: string;
  lecturerIds: string[];
}

export interface CourseEditionDetailsDTO {
  courseId: string;
  termId: string;
  groups: CourseGroupDTO[];
}

async function fetchCourseUnitGroups(
  unitId: string,
): Promise<CourseGroupDTO[]> {
  const data = await fetchUsosApi<UsosCourseUnit>("courses/unit", {
    unit_id: unitId,
    fields: "id|classtype_id|groups[group_number|lecturers]",
  });

  if (data.groups == null || data.groups.length === 0) {
    return [
      {
        unitId: data.id,
        groupNumber: "1",
        classtypeId: data.classtype_id,
        lecturerIds: [],
      },
    ];
  }

  return data.groups.map((group) => ({
    unitId: data.id,
    groupNumber: String(group.group_number),
    classtypeId: data.classtype_id,
    lecturerIds: group.lecturer_ids ?? [],
  }));
}

export async function getCourseEditionDetailsAction(
  courseId: string,
  termId: string,
): Promise<CourseEditionDetailsDTO> {
  return getOrSetRedis({
    redis,
    key: `usos:course_edition_details:${courseId}:${termId}`,
    ttlSeconds: 60 * 60 * 24,
    fetcher: async () => {
      const edition = await fetchUsosApi<UsosCourseEdition>(
        "courses/course_edition",
        {
          course_id: courseId,
          term_id: termId,
          fields: "course_units_ids",
        },
      );

      const unitIds = edition.course_units_ids ?? [];

      const groupsPerUnit = await Promise.all(
        unitIds.map(async (unitId) => fetchCourseUnitGroups(unitId)),
      );

      return {
        courseId,
        termId,
        groups: groupsPerUnit.flat(),
      };
    },
  });
}
