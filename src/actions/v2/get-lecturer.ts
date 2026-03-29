import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";

interface UsosLecturer {
  id: string;
  first_name: string;
  last_name: string;
  titles?: {
    before?: string | null;
    after?: string | null;
  };
  photo_urls?: {
    "50x50"?: string;
  };
  homepage_url?: string | null;
  profile_url?: string;
}

export interface LecturerDTO {
  id: string;
  firstName: string;
  lastName: string;
  titlesBefore?: string | null;
  titlesAfter?: string | null;
  photoUrl?: string | null;
  homepageUrl?: string | null;
  profileUrl?: string | null;
}

function normalizeLecturer(data: UsosLecturer): LecturerDTO {
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    titlesBefore: data.titles?.before ?? null,
    titlesAfter: data.titles?.after ?? null,
    photoUrl: data.photo_urls?.["50x50"] ?? null,
    homepageUrl: data.homepage_url ?? null,
    profileUrl: data.profile_url ?? null,
  };
}

export async function getLecturerAction(userId: string): Promise<LecturerDTO> {
  return getOrSetRedis({
    redis,
    key: `usos:user:${userId}`,
    ttlSeconds: 60 * 60 * 24 * 30,
    fetcher: async () => {
      const data = await fetchUsosApi<UsosLecturer>("users/user", {
        user_id: userId,
        fields:
          "id|first_name|last_name|titles|photo_urls|homepage_url|profile_url",
      });

      return normalizeLecturer(data);
    },
  });
}
