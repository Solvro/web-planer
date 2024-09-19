import Course from '#models/course'
import { createCourseValidator } from '#validators/course'
import type { HttpContext } from '@adonisjs/core/http'

export default class CoursesController {
  /**
   * Display a list of resource
   */
  async index({ request, params }: HttpContext) {
    const registrationId = params.registration_id
    const page = request.input('page', 1)
    const limit = 10
    if (registrationId) {
      return Course.query().where('registrationId', registrationId).paginate(page, limit)
    }
    return []
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
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await Course.findOrFail(params.index)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(createCourseValidator)
    const currCourse = await Course.findOrFail(params.index)
    currCourse.merge(payload)
    await currCourse.save()
    return { message: 'Course updated successfully.', currCourse }
  }

  /**
   * Delete record
   */
  async destroy(ctx: HttpContext) {
    const course = await this.show(ctx)
    await course.delete()
    return { message: 'Course successfully deleted.' }
  }
}
