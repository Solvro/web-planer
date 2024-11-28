import type { HttpContext } from '@adonisjs/core/http'
import Schedule from '#models/schedule'
import { createScheduleValidator, updateScheduleValidator } from '#validators/schedule'

export default class SchedulesController {
  /**
   * Display a list of user schedules
   */
  async index({ auth }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      return { message: 'User not authenticated.' }
    }

    const schedules = await Schedule.query().where('userId', userId)
    return schedules
  }

  /**
   * Handle form submission for the create action
   * Automatically assigns the logged-in user to the created schedule
   */
  async store({ request, auth }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      return { message: 'User not authenticated.' }
    }

    const payload = await request.validateUsing(createScheduleValidator)

    const schedule = await Schedule.create({
      ...payload,
      userId: userId,
    })

    return { message: 'Schedule created.', schedule }
  }

  /**
   * Show schedule with matching groups
   */
  async show({ params, auth }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      return { message: 'User not authenticated.' }
    }

    const schedule = await Schedule.query()
      .where('id', params.schedule_id)
      .andWhere('userId', userId)
      .preload('groups')
      .firstOrFail()

    return schedule
  }

  /**
   * Handle form submission for the edit action
   * Allows updating the schedule and modifying its groups
   */
  async update({ params, request, auth }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      return { message: 'User not authenticated.' }
    }

    const payload = await request.validateUsing(updateScheduleValidator)

    const currSchedule = await Schedule.query()
      .where('id', params.schedule_id)
      .andWhere('userId', userId)
      .firstOrFail()

    if (payload.name) {
      currSchedule.name = payload.name
    }

    if (payload.groups !== undefined) {
      if (payload.groups.length === 0) {
        await currSchedule.related('groups').sync([])
      } else {
        await currSchedule.related('groups').sync(payload.groups.map((group) => group.id))
      }
    }

    await currSchedule.save()

    return { message: 'Schedule updated successfully.', currSchedule }
  }

  /**
   * Delete record
   */
  async destroy({ params, auth }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) {
      return { message: 'User not authenticated.' }
    }

    const schedule = await Schedule.query()
      .where('id', params.schedule_id)
      .andWhere('userId', userId)
      .firstOrFail()

    await schedule.delete()
    return { message: 'Schedule successfully deleted.' }
  }
}
