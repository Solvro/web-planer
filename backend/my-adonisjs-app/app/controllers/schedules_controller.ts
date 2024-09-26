import type { HttpContext } from '@adonisjs/core/http'
import Schedule from '#models/schedule'
import { createScheduleValidator, updateScheduleValidator } from '#validators/schedule'
export default class SchedulesController {
  /**
   * Display a list of user schedules
   */
  async index({ params, auth }: HttpContext) {
    const userId = params.user_id
    const authUserId = auth.user?.id
    if (userId !== authUserId) {
      return 'Unauthorized access'
    }
    if (userId) {
      return Schedule.query().where('userId', userId)
    }
    return {}
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth, params }: HttpContext) {
    const userId = params.user_id
    const authUserId = auth.user?.id
    if (userId !== authUserId) {
      return 'Unauthorized access'
    }
    const payload = await request.validateUsing(createScheduleValidator)
    const schedule = await Schedule.create(payload)
    return { message: 'Schedule created.', schedule }
  }

  /**
   * Show schedule with matching courses
   */
  async show({ params, auth }: HttpContext) {
    const userId = params.user_id
    const authUserId = auth.user?.id
    if (userId !== authUserId) {
      return
    }
    const schedule = await Schedule.query()
      .where('id', params.id)
      .andWhere('userId', userId)
      .preload('courses')
      .firstOrFail()

    return schedule
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, auth }: HttpContext) {
    const userId = params.user_id
    const authUserId = auth.user?.id
    if (userId !== authUserId) {
      return 'Unauthorized access'
    }
    const payload = await request.validateUsing(updateScheduleValidator)
    const currSchedule = await Schedule.findOrFail(params.id)
    currSchedule.merge(payload)
    await currSchedule.save()
    return { message: 'Schedule updated successfully.', currSchedule }
  }
  /**
   * Delete record
   */
  async destroy(ctx: HttpContext) {
    const userId = ctx.params.user_id
    const authUserId = ctx.auth.user?.id
    if (userId !== authUserId) {
      return 'Unauthorized access'
    }
    const schedule = await this.show(ctx)
    if (!schedule) {
      return 'Schedule not found'
    }
    await schedule.delete()
    return { message: 'Schedule successfully deleted.' }
  }
}
