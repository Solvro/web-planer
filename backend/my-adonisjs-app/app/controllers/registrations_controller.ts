import Registration from '#models/registration'
import { createRegistrationValidator } from '#validators/registration'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegistrationsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    return Registration.query().paginate(page, limit)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createRegistrationValidator)
    const registration = await Registration.create(payload)
    return { message: 'Registration created.', registration }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await Registration.findOrFail(params.index)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(createRegistrationValidator)
    const currRegistration = await Registration.findOrFail(params.index)
    currRegistration.merge(payload)
    await currRegistration.save()
    return { message: 'Registration updated successfully.', currRegistration }
  }

  /**
   * Delete record
   */
  async destroy(ctx: HttpContext) {
    const registration = await this.show(ctx)
    await registration.delete()
    return { message: 'Registration successfully deleted.' }
  }
}
