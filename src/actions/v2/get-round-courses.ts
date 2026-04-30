import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";

export type CourseRegistrationStatus =
  | "register_and_unregister"
  | "unregister_only"
  | "closed"
  | "register_only";

interface UsosRoundCourse {
  course: {
    id: string;
    name: {
      pl: string;
    };
  };
  term_id: string;
  status: CourseRegistrationStatus;
  limits: number;
  is_linkage_required: boolean;
  registrations_count: number;
}

export interface RoundCourseDTO {
  courseId: string;
  courseName: string;
  termId: string;
  status: CourseRegistrationStatus;
  limits: number;
  isLinkageRequired: boolean;
  registrationsCount: number;
}

function normalizeRoundCourse(data: UsosRoundCourse): RoundCourseDTO {
  return {
    courseId: data.course.id,
    courseName: data.course.name.pl,
    termId: data.term_id,
    status: data.status,
    limits: data.limits,
    isLinkageRequired: data.is_linkage_required,
    registrationsCount: data.registrations_count,
  };
}

export async function getRegistrationRoundCoursesAction(
  roundId: string,
): Promise<RoundCourseDTO[]> {
  return getOrSetRedis({
    redis,
    key: `usos:round_courses:${roundId}`,
    ttlSeconds: 60,
    fetcher: async () => {
      const data = await fetchUsosApi<UsosRoundCourse[] | null>(
        "registrations/registration_round_courses",
        {
          registration_round_id: roundId,
          fields:
            "course|term_id|status|limits|is_linkage_required|registrations_count",
        },
      );

      if (data == null) {
        return [];
      }

      return data.map((course) => normalizeRoundCourse(course));
    },
  });
}
