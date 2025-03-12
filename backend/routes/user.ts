import Elysia from "elysia";

import { AuthController } from "@/controllers/auth-controller";
import { updateUserBody } from "@/validators";

import { isAuthenticated } from "../middlewares/auth-middleware";
import { jwtAccessSetup } from "../setups/jwt";

export const RouteUsers = (app: Elysia) =>
  app.use(jwtAccessSetup).group("/user", (users) => {
    users.use(AuthController.loginWithUsos);
    users.use(isAuthenticated).get("/", async ({ user }) => {
      return user;
    });
    users.use(updateUserBody).post(
      "/",
      async ({ body }) => {
        return body;
      },
      { body: "updateUserBody" },
    );
    users.use(isAuthenticated).get("/logout", async ({ cookie: { auth } }) => {
      auth.remove();
      return { message: "Logged out" };
    });

    users
      .use(isAuthenticated)
      .get("/test", async function handler({ body, set, user }) {
        return { message: "Testsss", user };
      });

    return users;
  });
