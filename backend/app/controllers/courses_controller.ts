import assert from "node:assert";

import type { HttpContext } from "@adonisjs/core/http";

import Course from "#models/course";
import { createCourseValidator } from "#validators/course";

export default class CoursesController {
  /**
   * Display a list of courses in matching registration
   */
  async index({ params }: HttpContext) {
    assert(typeof params.registration_id === "string");

    const registrationId = decodeURIComponent(params.registration_id);
    if (!registrationId) {
      return [];
    }

    const courses = await Course.query()
      .where("registrationId", registrationId)
      .preload("groups", (groupQuery) => groupQuery.preload("lecturers"));

    const transformedCourses = courses.map((course) => ({
      id: course.id,
      name: course.name,
      registrationId: course.registrationId,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      groups: course.groups.map((group) => ({
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
      })),
    }));

    return transformedCourses;
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, params }: HttpContext) {
    assert(typeof params.registration_id === "string");

    const registrationId = decodeURIComponent(params.registration_id);
    const payload = await request.validateUsing(createCourseValidator);
    const course = await Course.create({ ...payload, registrationId });
    return { message: "Course created.", course };
  }

  /**
   * Show individual record of course in matching registration
   */
  async show({ params }: HttpContext) {
    assert(typeof params.registration_id === "string");
    assert(typeof params.id === "string");
    const registrationId = decodeURIComponent(params.registration_id);

    if (!registrationId) {
      return [];
    }

    const course = await Course.query()
      .where("registrationId", registrationId)
      .andWhere("id", params.id)
      .preload("groups", (groupQuery) => groupQuery.preload("lecturers"))
      .firstOrFail();

    const transformedCourse = {
      id: course.id,
      name: course.name,
      registrationId: course.registrationId,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      groups: course.groups.map((group) => ({
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
      })),
    };

    return transformedCourse;
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    assert(typeof params.registration_id === "string");
    assert(typeof params.id === "string");

    const registrationId = decodeURIComponent(params.registration_id);
    const payload = await request.validateUsing(createCourseValidator);

    const course = await Course.query()
      .where("registrationId", registrationId)
      .andWhere("id", params.id)
      .firstOrFail();

    course.merge(payload);
    await course.save();

    return { message: "Course updated successfully.", course };
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const course = await Course.findOrFail(params.id);
    await course.delete();
    return { message: "Course successfully deleted." };
  }
}
