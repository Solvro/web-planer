import assert from "node:assert";

import type { HttpContext } from "@adonisjs/core/http";

import Group from "#models/group";
import { createGroupValidator } from "#validators/group";

export default class GroupsController {
  /**
   * Display a list of all groups in matching course
   */
  async index({ params }: HttpContext) {
    const courseId = params.course_id as unknown;
    if (typeof courseId === "string") {
      return Group.query().where("courseId", courseId);
    }
    return {};
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createGroupValidator);
    const group = await Group.create(payload);
    return { message: "Group created.", course: group };
  }

  /**
   * Show individual group in matching group
   */
  async show({ params }: HttpContext) {
    const courseId = params.course_id as unknown;
    if (typeof courseId === "string") {
      assert(typeof params.id === "string");

      return await Group.query()
        .where("courseId", courseId)
        .andWhere("id", params.id);
    }
    return {};
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(createGroupValidator);
    const currGroup = await Group.findOrFail(params.id);
    currGroup.merge(payload);
    await currGroup.save();
    return { message: "Group updated successfully.", currGroup };
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const course = await Group.findOrFail(params.id);
    await course.delete();
    return { message: "Group successfully deleted." };
  }
}
