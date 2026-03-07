import type { BetterAuthClientPlugin } from "better-auth/client";

import type { usosAuth } from "./usos-auth";

export const usosAuthClient = () => {
  return {
    id: "usos-auth",
    $InferServerPlugin: {} as ReturnType<typeof usosAuth>,
  } satisfies BetterAuthClientPlugin;
};
