import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";

export const jwtAccessSetup = new Elysia({
  name: "jwtAccess",
}).use(
  jwt({
    name: "jwt",
    schema: t.Object({
      id: t.Number(),
      studentNumber: t.String(),
      usosId: t.String(),
      firstName: t.String(),
      lastName: t.String(),
      avatar: t.String(),
      verified: t.Boolean(),
    }),
    secret: process.env.APP_KEY!,
    exp: "7d",
  }),
);
