import { cookies } from "next/headers";

import { usosService } from "@/services/usos";
import { createClient } from "@/services/usos/usosClient";

export const createUsosService = () => {
  const tokens = {
    token: cookies().get("access_token")?.value,
    secret: cookies().get("access_token_secret")?.value,
    fetch,
  };

  return usosService(createClient(tokens));
};
