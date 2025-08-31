import type { HttpContext } from "@adonisjs/core/http";

import Group from "#models/group";
import { createGroupValidator } from "#validators/group";

export default class GroupsController {
  /**
   * Display a list of all groups in matching course
   */
  async index({ params }: HttpContext) {
    const courseId = params.course_id as string;

    if (courseId) {
      const groups = await Group.query()
        .where("courseId", courseId)
        .andWhere("isActive", true)
        .orWhereNull("isActive")
        .preload("meetings")
        .preload("lecturers");

      const transformedGroups = groups.map((group) => ({
        id: group.id,
        name: group.name,
        lecturer: Array.isArray(group.lecturers)
          ? group.lecturers
              .map((lecturer) => `${lecturer.name} ${lecturer.surname}`)
              .join(", ")
          : "Brak prowadzącego",
        averageRating: Array.isArray(group.lecturers)
          ? (
              group.lecturers.reduce(
                (total, lecturer) =>
                  total + (Number.parseFloat(lecturer.averageRating) || 0),
                0,
              ) / group.lecturers.length
            ).toFixed(2)
          : 0,
        ...group.serialize(),
      }));

      return transformedGroups;
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
    const courseId = params.course_id as string;

    if (courseId && typeof params.id === "string") {
      const group = await Group.query()
        .where("courseId", courseId)
        .andWhere("id", params.id)
        .andWhere("isActive", true)
        .orWhereNull("isActive")
        .preload("meetings")
        .preload("lecturers")
        .firstOrFail();

      const transformedGroup = {
        id: group.id,
        name: group.name,
        lecturer: Array.isArray(group.lecturers)
          ? group.lecturers
              .map((lecturer) => `${lecturer.name} ${lecturer.surname}`)
              .join(", ")
          : "Brak prowadzącego",
        averageRating:
          Array.isArray(group.lecturers) && group.lecturers.length > 0
            ? (
                group.lecturers
                  .map((lecturer) => Number.parseFloat(lecturer.averageRating))
                  .filter((rating) => !Number.isNaN(rating))
                  .reduce((total, rating) => total + rating, 0) /
                group.lecturers.length
              ).toFixed(2)
            : "0.00",
        opinionsCount:
          Array.isArray(group.lecturers) && group.lecturers.length > 0
            ? group.lecturers
                .map((lecturer) => Number.parseInt(lecturer.opinionsCount, 10))
                .filter((count) => !Number.isNaN(count))
                .reduce((total, count) => total + count, 0)
            : 0,
        ...group.serialize(),
      };

      return transformedGroup;
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
