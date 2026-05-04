import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";

interface UsosRegistrationRound {
  id: string;
  name: {
    pl: string;
    en: string;
  };
  status: "active" | "preparing" | "closed";
  registration_mode:
    | "double_for_courses"
    | "double_for_group_with_ask"
    | "double_group_manual"
    | "direct_for__courses_and_groups";
  start_date: Date;
  end_date: Date;
}

function sortByStartDateFunction(
  a: UsosRegistrationRound,
  b: UsosRegistrationRound,
): number {
  return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
}

export async function getRegistrationRoundsAction(
  registrationId: string,
): Promise<UsosRegistrationRound[]> {
  return getOrSetRedis({
    redis,
    key: `usos:registration_rounds:${registrationId}`,
    ttlSeconds: 60,
    fetcher: async () => {
      const data = await fetchUsosApi<UsosRegistrationRound[]>(
        `registrations/course_registration_rounds`,
        {
          registration_id: registrationId,
          fields: "fields=id|name|status|registration_mode|start_date|end_date",
        },
      );

      return data.toSorted(sortByStartDateFunction);
    },
  });
}
