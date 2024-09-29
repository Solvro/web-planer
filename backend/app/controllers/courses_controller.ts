import Course from '#models/course'
import { createCourseValidator } from '#validators/course'
import type { HttpContext } from '@adonisjs/core/http'

export default class CoursesController {
  /**
   * Display a list of courses in matching registration
   */
  async index({ params }: HttpContext) {
    const registrationId = params.registration_id
    if (registrationId) {
      return Course.query().where('registrationId', registrationId)
    }
    return {}
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createCourseValidator)
    const course = await Course.create(payload)
    return { message: 'Course created.', course }
  }

  /**
   * Show individual record of course in matching registration
   */
  async show({ params }: HttpContext) {
    const registrationId = params.registration_id
    if (registrationId) {
      return await Course.query().where('registrationId', registrationId).andWhere('id', params.id)
    }
    return {}
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(createCourseValidator)
    const currCourse = await Course.findOrFail(params.id)
    currCourse.merge(payload)
    await currCourse.save()
    return { message: 'Course updated successfully.', currCourse }
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const course = await Course.findOrFail(params.id)
    await course.delete()
    return { message: 'Course successfully deleted.' }
  }
}
