import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";

interface UsosClassgroupDate {
  start_time: string;
  end_time: string;
  room?: {
    id?: string | null;
    building_name?: string | null;
    number?: string | null;
  } | null;
}

export interface ClassgroupDateDTO {
  date: string;
  startTime: string;
  endTime: string;
}

function normalizeClassgroupDate(raw: UsosClassgroupDate): ClassgroupDateDTO {
  const spaceIndex = raw.start_time.indexOf(" ");
  const date = raw.start_time.slice(0, spaceIndex);
  const startTime = raw.start_time.slice(spaceIndex + 1, spaceIndex + 6);
  const endSpaceIndex = raw.end_time.indexOf(" ");
  const endTime = raw.end_time.slice(endSpaceIndex + 1, endSpaceIndex + 6);

  return { date, startTime, endTime };
}

export async function getClassgroupDatesAction(
  unitId: string,
  groupNumber: string,
): Promise<ClassgroupDateDTO[]> {
  return getOrSetRedis({
    redis,
    key: `usos:classgroup_dates:${unitId}:${groupNumber}`,
    ttlSeconds: 60 * 15,
    fetcher: async () => {
      const data = await fetchUsosApi<UsosClassgroupDate[]>(
        "classgroups/classgroup_dates2",
        {
          unit_id: unitId,
          group_number: groupNumber,
          fields: "start_time|end_time|room",
        },
      );

      if (!Array.isArray(data) || data.length === 0) {
        return [];
      }

      return data.map((item) => normalizeClassgroupDate(item));
    },
  });
}
