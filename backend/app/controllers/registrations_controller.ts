import Registration from '#models/registration'
import { createRegistrationValidator } from '#validators/registration'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegistrationsController {
  /**
   * Display a list of all registrations
   */
  async index({ params }: HttpContext) {
    const departmentId = params.department_id
    if (departmentId) {
      return Registration.query().where('departmentId', departmentId)
    }
    return {}
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
   * Show individual registration
   */
  async show({ params }: HttpContext) {
    const departmentId = decodeURIComponent(params.department_id)
    const registrationId = decodeURIComponent(params.id)

    if (departmentId && registrationId) {
      return await Registration.query()
        .where('departmentId', departmentId)
        .andWhere('id', registrationId)
    }

    return {}
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const departmentId = decodeURIComponent(params.department_id)
    const registrationId = decodeURIComponent(params.id)

    const payload = await request.validateUsing(createRegistrationValidator)

    const currRegistration = await Registration.query()
      .where('departmentId', departmentId)
      .andWhere('id', registrationId)
      .firstOrFail()

    currRegistration.merge(payload)
    await currRegistration.save()

    return { message: 'Registration updated successfully.', currRegistration }
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const departmentId = decodeURIComponent(params.department_id)
    const registrationId = decodeURIComponent(params.id)

    const registration = await Registration.query()
      .where('departmentId', departmentId)
      .andWhere('id', registrationId)
      .firstOrFail()

    await registration.delete()

    return { message: 'Registration successfully deleted.' }
  }
}
