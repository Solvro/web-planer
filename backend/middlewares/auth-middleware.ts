import type { Elysia } from "elysia";

import { jwtAccessSetup } from "../setups/jwt";

export const isAuthenticated = (app: Elysia) =>
  app.use(jwtAccessSetup).derive(async function handler({
    jwt,
    cookie: { auth },
    error,
  }) {
    const user = await jwt.verify(auth.value);
    if (!user) {
      return error(401, "Unauthorized");
    }

    return { user };
  });
