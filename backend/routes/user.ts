import Elysia from "elysia";

import { AuthController } from "@/controllers/auth-controller";

import { isAuthenticated } from "../middlewares/auth-middleware";
import { jwtAccessSetup } from "../setups/jwt";

export const RouteUsers = (app: Elysia) =>
  app.use(jwtAccessSetup).group("/user", (users) => {
    users.use(AuthController.login);
    users.get("/", async ({ jwt, error, cookie: { auth } }) => {
      const user = await jwt.verify(auth.value);
      if (!user) {
        return error(401, "Unauthorized");
      }

      return user;
    });
    users
      .use(isAuthenticated)
      .get("/test", async function handler({ body, set, user }) {
        return { message: "Testsss", user };
      });

    return users;
  });
