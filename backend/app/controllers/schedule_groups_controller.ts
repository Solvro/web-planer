import assert from "node:assert";

import type { HttpContext } from "@adonisjs/core/http";

import Group from "#models/group";
import Schedule from "#models/schedule";

export default class ScheduleGroupsController {
  /**
   * Get the groups attached to schedule
   */
  async index({ params }: HttpContext) {
    assert(typeof params.schedule_id === "string");
    const scheduleId = params.schedule_id;

    const schedule = await Schedule.query()
      .where("id", scheduleId)
      .preload("groups")
      .firstOrFail();

    return schedule.groups;
  }

  /**
   * Add group to the schedule
   */
  async store({ params, request, response }: HttpContext) {
    assert(typeof params.schedule_id === "string");

    const scheduleId = params.schedule_id;
    const groupId = request.input("group_id") as string | undefined;

    if (groupId === undefined) {
      return response.badRequest({ message: "Group ID is required." });
    }

    const schedule = await Schedule.findOrFail(scheduleId);
    const group = await Group.findOrFail(groupId);

    const isAlreadyAttached = await schedule
      .related("groups")
      .query()
      .where("group_id", groupId)
      .first();

    if (isAlreadyAttached !== null) {
      return { message: "Group is already added to this schedule." };
    }

    await schedule.related("groups").attach([group.id]);

    return { message: "Group added to schedule successfully." };
  }

  /**
   * Delete group from the schedule
   */
  async destroy({ params }: HttpContext) {
    assert(typeof params.schedule_id === "string");
    assert(typeof params.group_id === "string");

    const scheduleId = params.schedule_id;
    const groupId = params.group_id;

    const schedule = await Schedule.findOrFail(scheduleId);

    await schedule.related("groups").detach([groupId]);

    return { message: "Group removed from schedule successfully." };
  }
}
