import { DateTime } from "luxon";
import assert from "node:assert";

import type { HttpContext } from "@adonisjs/core/http";

import Schedule from "#models/schedule";
import {
  createScheduleValidator,
  updateScheduleValidator,
} from "#validators/schedule";

export default class SchedulesController {
  /**
   * Display a list of user schedules
   */
  async index({ auth }: HttpContext) {
    const userId = auth.user?.id;
    if (userId === undefined) {
      return { message: "User not authenticated." };
    }

    // Pobierz wszystkie harmonogramy użytkownika
    const schedules = await Schedule.query()
      .where("userId", userId)
      .preload("registrations") // Preload registrations dla każdego harmonogramu
      .preload("courses"); // Preload courses dla każdego harmonogramu

    // Przetwórz każdy harmonogram, aby uzyskać pożądaną strukturę
    const transformedSchedules = await Promise.all(
      schedules.map(async (schedule) => {
        // Pobierz grupy powiązane z kursami w harmonogramie
        const courseGroups = await schedule
          .related("courses")
          .query()
          .preload("groups", (groupQuery) =>
            groupQuery.whereExists((subQuery) =>
              subQuery
                .from("schedule_groups")
                .whereRaw("schedule_groups.group_id = groups.id")
                .andWhere("schedule_groups.schedule_id", schedule.id),
            ),
          );

        return {
          id: schedule.id,
          userId: schedule.userId,
          createdAt: schedule.createdAt,
          updatedAt: schedule.updatedAt,
          name: schedule.name,
          registrations: schedule.registrations.map((reg) => ({
            id: reg.id,
            ...reg.serialize(),
          })),
          courses: courseGroups.map((course) => ({
            id: course.id,
            name: course.name,
            groups: course.groups.map((group) => ({
              id: group.id,
              name: group.name,
              ...group.serialize(),
            })),
          })),
        };
      }),
    );

    return transformedSchedules;
  }

  /**
   * Handle form submission for the create action
   * Automatically assigns the logged-in user to the created schedule
   */
  async store({ request, auth }: HttpContext) {
    const userId = auth.user?.id;
    if (userId === undefined) {
      return { message: "User not authenticated." };
    }

    const payload = await request.validateUsing(createScheduleValidator);

    const schedule = await Schedule.create({
      ...payload,
      userId,
    });

    if (payload.groups !== undefined) {
      await schedule
        .related("groups")
        .sync(payload.groups.map((group) => group.id));
    }

    if (payload.registrations !== undefined) {
      await schedule
        .related("registrations")
        .sync(payload.registrations.map((group) => group.id));
    }

    if (payload.courses !== undefined) {
      await schedule
        .related("courses")
        .sync(payload.courses.map((group) => group.id));
    }

    return { message: "Schedule created.", schedule };
  }

  /**
   * Show schedule with matching groups
   */
  async show({ params, auth }: HttpContext) {
    const userId = auth.user?.id;
    if (userId === undefined) {
      return { message: "User not authenticated." };
    }

    const scheduleId = params.schedule_id as unknown;

    assert(typeof scheduleId === "string");

    const schedule = await Schedule.query()
      .where("id", scheduleId)
      .andWhere("userId", userId)
      .preload("registrations") // Preload registrations
      .preload("courses") // Preload courses (grupy powiązane z kursami zostaną załadowane osobno)
      .firstOrFail();

    // Pobranie grup powiązanych z kursami z uwzględnieniem schedule_id
    const courseGroups = await schedule
      .related("courses")
      .query()
      .preload("groups", (groupQuery) =>
        groupQuery.whereExists((subQuery) =>
          subQuery
            .from("schedule_groups")
            .whereRaw("schedule_groups.group_id = groups.id")
            .andWhere("schedule_groups.schedule_id", scheduleId),
        ),
      );

    // Transformacja danych do żądanej struktury
    const transformedSchedule = {
      id: schedule.id,
      userId: schedule.userId,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
      name: schedule.name,
      registrations: schedule.registrations.map((reg) => ({
        id: reg.id,
        ...reg.serialize(),
      })),
      courses: courseGroups.map((course) => ({
        id: course.id,
        name: course.name,
        groups: course.groups.map((group) => ({
          id: group.id,
          name: group.name,
          ...group.serialize(),
        })),
      })),
    };

    return transformedSchedule;
  }

  /**
   * Handle form submission for the edit action
   * Allows updating the schedule and modifying its groups
   */
  async update({ params, request, auth }: HttpContext) {
    try {
      const userId = auth.user?.id;
      if (userId === undefined) {
        return { message: "User not authenticated." };
      }

      const payload = await request.validateUsing(updateScheduleValidator);

      const currSchedule = await Schedule.query()
        .where("id", params.schedule_id as string)
        .andWhere("userId", userId)
        .firstOrFail();

      if (payload.name !== undefined) {
        currSchedule.name = payload.name;
      }

      if (payload.groups !== undefined) {
        if (payload.groups.length === 0) {
          await currSchedule.related("groups").sync([]);
        } else {
          await currSchedule
            .related("groups")
            .sync(payload.groups.map((group) => group.id));
        }
      }

      if (payload.registrations !== undefined) {
        if (payload.registrations.length === 0) {
          await currSchedule.related("registrations").sync([]);
        } else {
          await currSchedule
            .related("registrations")
            .sync(payload.registrations.map((group) => group.id));
        }
      }

      if (payload.courses !== undefined) {
        if (payload.courses.length === 0) {
          await currSchedule.related("courses").sync([]);
        } else {
          await currSchedule
            .related("courses")
            .sync(payload.courses.map((group) => group.id));
        }
      }

      currSchedule.updatedAt = DateTime.fromISO(new Date().toISOString());

      await currSchedule.save();

      return {
        message: "Schedule updated successfully.",
        schedule: currSchedule,
        success: true,
      };
    } catch {
      return { message: "Schedule not found.", success: false };
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, auth }: HttpContext) {
    const userId = auth.user?.id;
    if (userId === undefined) {
      return { message: "User not authenticated." };
    }

    try {
      const schedule = await Schedule.query()
        .where("id", params.schedule_id as string)
        .andWhere("userId", userId)
        .firstOrFail();

      await schedule.delete();
      return { success: true, message: "Schedule successfully deleted." };
    } catch {
      return { success: false, message: "Schedule not found." };
    }
  }
}
