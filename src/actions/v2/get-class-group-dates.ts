import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";

interface UsosClassgroupDate {
  start_time?: string | null;
  end_time?: string | null;
  name?: string | null;
  room_number?: string | null;
  building_name?: string | null;
  classtype_id?: string | number | null;
}

export interface ClassgroupDateDTO {
  startTime: string | null;
  endTime: string | null;
  name: string | null;
  roomNumber: string | null;
  buildingName: string | null;
  classtypeId: string | number | null;
  weekday: number | null;
}

function getWeekday(dateString: string | null): number | null {
  if (dateString == null || dateString === "") {
    return null;
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.getDay();
}

function normalizeClassgroupDates(
  data: UsosClassgroupDate[],
): ClassgroupDateDTO[] {
  return data.map((item) => ({
    startTime: item.start_time ?? null,
    endTime: item.end_time ?? null,
    name: item.name ?? null,
    roomNumber: item.room_number ?? null,
    buildingName: item.building_name ?? null,
    classtypeId: item.classtype_id ?? null,
    weekday: getWeekday(item.start_time ?? null),
  }));
}

export async function getClassgroupDatesAction(
  unitId: string,
  groupNumber: string,
): Promise<ClassgroupDateDTO[]> {
  return getOrSetRedis({
    redis,
    key: `usos:classgroup_dates2:${unitId}:${groupNumber}`,
    ttlSeconds: 60 * 60 * 24 * 7,
    fetcher: async () => {
      const data = await fetchUsosApi<UsosClassgroupDate[]>(
        "tt/classgroup_dates2",
        {
          unit_id: unitId,
          group_number: groupNumber,
          fields:
            "start_time|end_time|name|room_number|building_name|classtype_id",
        },
      );

      const normalized = normalizeClassgroupDates(data);

      return normalized.sort((a, b) => {
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return (
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      });
    },
  });
}
