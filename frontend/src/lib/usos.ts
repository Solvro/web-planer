import { cookies as cookiesPromise } from "next/headers";

import { usosService } from "@/services/usos";
import { createClient } from "@/services/usos/usosClient";

export const createUsosService = async () => {
  const cookies = await cookiesPromise();
  const tokens = {
    token: cookies.get("access_token")?.value,
    secret: cookies.get("access_token_secret")?.value
  };

  return usosService(createClient(tokens));
};
