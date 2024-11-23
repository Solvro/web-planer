import Course from '#models/course'
import { createCourseValidator } from '#validators/course'
import type { HttpContext } from '@adonisjs/core/http'

export default class CoursesController {
  /**
   * Display a list of courses in matching registration
   */
  async index({ params }: HttpContext) {
    const registrationId = decodeURIComponent(params.registration_id)
    if (registrationId) {
      return await Course.query().where('registrationId', registrationId).preload('courses')
    }
    return []
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, params }: HttpContext) {
    const registrationId = decodeURIComponent(params.registration_id)
    const payload = await request.validateUsing(createCourseValidator)
    const course = await Course.create({ ...payload, registrationId })
    return { message: 'Course created.', course }
  }

  /**
   * Show individual record of course in matching registration
   */
  async show({ params }: HttpContext) {
    const registrationId = decodeURIComponent(params.registration_id)
    if (registrationId) {
      return await Course.query()
        .where('registrationId', registrationId)
        .andWhere('id', params.id)
        .preload('groups')
        .firstOrFail()
    }
    return {}
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const registrationId = decodeURIComponent(params.registration_id)
    const payload = await request.validateUsing(createCourseValidator)

    const course = await Course.query()
      .where('registrationId', registrationId)
      .andWhere('id', params.id)
      .firstOrFail()

    course.merge(payload)
    await course.save()

    return { message: 'Course updated successfully.', course }
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
