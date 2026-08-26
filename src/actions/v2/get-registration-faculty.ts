"use server";

import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";

interface RegistrationFacultyDTO {
  registrationId: string;
  faculty: {
    id: string;
    name: string;
    profile_url: string;
    homepage_url: string;
    email: string;
  };
}

interface UsosRegistration {
  id: string;
  description: string;
  message: string;
  type: string;
  faculty: {
    id: string;
    name: string;
    profile_url: string;
    homepage_url: string;
    email: string;
    //...more fields that are useless and i didnt want to describe them
  };
}

export async function getRegistrationFacultyAction(
  registrationId: string,
): Promise<RegistrationFacultyDTO> {
  return getOrSetRedis({
    redis,
    key: `usos:registration_faculty:${registrationId}`,
    ttlSeconds: 60 * 60 * 24,
    fetcher: async () => {
      const data = await fetchUsosApi<UsosRegistration>(
        `registrations/registration`,
        {
          id: registrationId,
          fields: "id|description|message|type|faculty",
        },
      );
      return {
        registrationId,
        faculty: data.faculty,
      };
    },
  });
}
