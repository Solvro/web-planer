import Schedule from '#models/schedule'
import Group from '#models/group'
import type { HttpContext } from '@adonisjs/core/http'

export default class ScheduleGroupsController {
  /**
   * Get the groups attached to schedule
   */
  async index({ params }: HttpContext) {
    const scheduleId = params.schedule_id

    const schedule = await Schedule.query().where('id', scheduleId).preload('groups').firstOrFail()

    return schedule.groups
  }

  /**
   * Add group to the schedule
   */
  async store({ params, request }: HttpContext) {
    const scheduleId = params.schedule_id
    const groupId = request.input('group_id')

    const schedule = await Schedule.findOrFail(scheduleId)
    const group = await Group.findOrFail(groupId)

    await schedule.related('groups').attach([group.id])

    return { message: 'Group added to schedule successfully.' }
  }

  /**
   * Delete group from the schedule
   */
  async destroy({ params }: HttpContext) {
    const scheduleId = params.schedule_id
    const groupId = params.group_id

    const schedule = await Schedule.findOrFail(scheduleId)

    await schedule.related('groups').detach([groupId])

    return { message: 'Group removed from schedule successfully.' }
  }
}
