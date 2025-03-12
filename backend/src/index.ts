import { Elysia } from "elysia";

import { RouteDepartments } from "../routes/departments";
import { RouteUsers } from "../routes/user";

const app = new Elysia().get("/", () => "Hello Elysia");
app.use(RouteDepartments);
app.use(RouteUsers);
app.listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
