import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";

interface UsosCourseEditionGroup {
  start_time: string;
  end_time: string;
  type: string;
  course_id: string;
  course_name: {
    pl: string;
  };
  group_number: number;
  classtype_id: string;
  classtype_name: {
    pl: string;
  };
  unit_id: string;
  room_number: string;
  building_name: string;
  lecturer_ids: string[];
  classgroup_profile_url: string;
}

export interface CourseGroupDTO {
  courseId: string;
  courseName: string;
  groupNumber: number;
  classtypeId: string;
  classtypeName: string;
  unitId: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  buildingName: string;
  lecturerIds: string[];
  classgroupProfileUrl: string;
}

function normalizeCourseGroup(data: UsosCourseEditionGroup): CourseGroupDTO {
  return {
    courseId: data.course_id,
    courseName: data.course_name.pl,
    groupNumber: data.group_number,
    classtypeId: data.classtype_id,
    classtypeName: data.classtype_name.pl,
    unitId: data.unit_id,
    startTime: data.start_time,
    endTime: data.end_time,
    roomNumber: data.room_number,
    buildingName: data.building_name,
    lecturerIds: data.lecturer_ids,
    classgroupProfileUrl: data.classgroup_profile_url,
  };
}

export async function getCourseEditionGroupsAction(
  courseId: string,
  termId: string,
  start: string,
  days: number,
): Promise<CourseGroupDTO[]> {
  return getOrSetRedis({
    redis,
    key: `usos:course_edition:${courseId}:${termId}:${start}:${days.toString()}`,
    ttlSeconds: 43_200,
    fetcher: async () => {
      const data = await fetchUsosApi<UsosCourseEditionGroup[] | null>(
        "tt/course_edition",
        {
          course_id: courseId,
          term_id: termId,
          start,
          days: days.toString(),
          fields:
            "start_time|end_time|type|course_id|course_name|group_number|classtype_id|classtype_name|unit_id|room_number|building_name|lecturer_ids|classgroup_profile_url",
        },
      );

      if (data == null) {
        return [];
      }

      return data.map((group) => normalizeCourseGroup(group));
    },
  });
}
