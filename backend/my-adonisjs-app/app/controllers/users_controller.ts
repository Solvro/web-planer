import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10
    return User.query().paginate(page, limit)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = request.only(['id'])
    const user = await User.create(payload)
    return { message: 'User created.', user }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await User.findOrFail(params.index)
  }

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy(ctx: HttpContext) {
    const user = await this.show(ctx)
    await user.delete()
    return { message: 'Member successfully deleted.' }
  }
}
