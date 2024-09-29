import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async store({ request, auth, response }: HttpContext) {
    /**
     * Step 1: Get credentials from the request body
     */
    const { id, password } = request.only(['id', 'password'])

    /**
     * Step 2: Verify credentials
     */
    const user = await User.verifyCredentials(id, password)

    /**
     * Step 3: Login user
     */
    await auth.use('web').login(user)

    /**
     * Step 4: Send them to a protected route
     */
    response.redirect(`users/${id}/schedules`)
  }
}
