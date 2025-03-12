import Elysia from "elysia";

import { CoursesController } from "../controllers/courses-controller";
import { DepartmentsController } from "../controllers/departments-controller";
import { GroupsController } from "../controllers/groups-controller";
import { RegistrationsController } from "../controllers/registrations-controller";

export const RouteDepartments = (app: Elysia) =>
  app.group("/departments", (departments) => {
    departments.get("/", () => DepartmentsController.getDepartments());
    departments.get("/:department_id", ({ params }) =>
      DepartmentsController.getDepartmentById(params.department_id),
    );

    departments.get("/:department_id/registrations", ({ params }) =>
      RegistrationsController.getRegistrations(params.department_id),
    );
    departments.get(
      "/:department_id/registrations/:registration_id",
      ({ params }) =>
        RegistrationsController.getRegistrationById(
          params.department_id,
          params.registration_id,
        ),
    );

    departments.get(
      "/:department_id/registrations/:registration_id/courses",
      ({ params }) => CoursesController.getCourses(params.registration_id),
    );
    departments.get(
      "/:department_id/registrations/:registration_id/courses/:course_id",
      ({ params }) =>
        CoursesController.getCourseById(
          params.registration_id,
          params.course_id,
        ),
    );

    departments.get(
      "/:department_id/registrations/:registration_id/courses/:course_id/groups",
      ({ params }) => GroupsController.getGroups(params.course_id),
    );
    departments.get(
      "/:department_id/registrations/:registration_id/courses/:course_id/groups/:group_id",
      ({ params }) =>
        GroupsController.getGroupsById(params.course_id, params.group_id),
    );

    return departments;
  });
