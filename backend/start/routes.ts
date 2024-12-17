/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import AutoSwagger from "adonis-autoswagger";

import router from "@adonisjs/core/services/router";

import swagger from "#config/swagger";

import { middleware } from "./kernel.js";

const DepartmentsController = () =>
  import("#controllers/departments_controller");
const AuthController = () => import("#controllers/auth_controller");
const SchedulesController = () => import("#controllers/schedules_controller");
const RegistrationsController = () =>
  import("#controllers/registrations_controller");
const CoursesController = () => import("#controllers/courses_controller");
const GroupsController = () => import("#controllers/groups_controller");

router.get("/swagger", async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger);
});

// Renders Swagger-UI and passes YAML-output of /swagger
router.get("/docs", async () => {
  return AutoSwagger.default.ui("/swagger", swagger);
  // return AutoSwagger.default.scalar("/swagger"); to use Scalar instead
  // return AutoSwagger.default.rapidoc("/swagger", "view"); to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
});

router.get("/departments", [DepartmentsController, "index"]);
router.get("/departments/:id", [DepartmentsController, "show"]);

router.get("/departments/:department_id/registrations", [
  RegistrationsController,
  "index",
]);
router.get("/departments/:department_id/registrations/:id", [
  RegistrationsController,
  "show",
]);

router.get(
  "/departments/:department_id/registrations/:registration_id/courses",
  [CoursesController, "index"],
);
router.get(
  "/departments/:department_id/registrations/:registration_id/courses/:id",
  [CoursesController, "show"],
);

router.get(
  "/departments/:department_id/registrations/:registration_id/courses/:course_id/groups",
  [GroupsController, "index"],
);
router.get(
  "/departments/:department_id/registrations/:registration_id/courses/:course_id/groups/:id",
  [GroupsController, "show"],
);

router
  .get("/user/schedules", [SchedulesController, "index"])
  .use(middleware.usosAuth());
router
  .get("/user/schedules/:schedule_id", [SchedulesController, "show"])
  .use(middleware.usosAuth());
router
  .post("/user/schedules", [SchedulesController, "store"])
  .use(middleware.usosAuth());
router
  .patch("/user/schedules/:schedule_id", [SchedulesController, "update"])
  .use(middleware.usosAuth());
router
  .delete("/user/schedules/:schedule_id", [SchedulesController, "destroy"])
  .use(middleware.usosAuth());

router.post("user/login", [AuthController, "store"]).use(middleware.guest());
router
  .delete("user/logout", [AuthController, "destroy"])
  .use(middleware.usosAuth());
