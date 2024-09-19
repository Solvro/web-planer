import type { HttpContext } from '@adonisjs/core/http'
import Schedule from '#models/schedule'
import { createScheduleValidator, updateScheduleValidator } from '#validators/schedule'
export default class SchedulesController {
  /**
   * Display a list of resource
   */
  async index({ params, request }: HttpContext) {
    const userId = params.user_id
    const page = request.input('page', 1)
    const limit = 10
    if (userId) {
      return Schedule.query().where('userId', userId).paginate(page, limit)
    }
    return []
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createScheduleValidator)
    const schedule = await Schedule.create(payload)
    return { message: 'Schedule created.', schedule }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await Schedule.findOrFail(params.index)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(updateScheduleValidator)
    const currSchedule = await Schedule.findOrFail(params.index)
    currSchedule.merge(payload)
    await currSchedule.save()
    return { message: 'Schedule updated successfully.', currSchedule }
  }
  /**
   * Delete record
   */
  async destroy(ctx: HttpContext) {
    const schedule = await this.show(ctx)
    await schedule.delete()
    return { message: 'Schedule successfully deleted.' }
  }
}
