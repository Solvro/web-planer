import { HttpContext } from '@adonisjs/core/http'
import { createClient } from '../usos/usos_client.js'
import User from '#models/user'

export default class AuthController {
  async store({ request, response, auth }: HttpContext) {
    /**
     * Step 1: Get credentials from the request body
     */
    const { accessToken, accessSecret } = request.only(['accessToken', 'accessSecret'])
    try {
      const usosClient = createClient({
        token: accessToken,
        secret: accessSecret,
      })
      const profile: any = await usosClient.get(
        'users/user?fields=id|student_number|first_name|last_name'
      )
      let user = await User.findBy('usos_id', profile.id)
      if (!user) {
        user = await User.create({
          usos_id: profile.id,
          studentNumber: profile.student_number,
          firstName: profile.first_name,
          lastName: profile.last_name,
        })
      }
      await auth.use('jwt').generate(user)
      return response.ok({
        ...user.serialize(),
      })
    } catch (error) {
      return response.unauthorized({ message: 'Login failed.', error: error.message })
    }
  }
  async destroy({ response }: HttpContext) {
    try {
      response.clearCookie('token')

      return response.ok({ message: 'Successfully logged out' })
    } catch (error) {
      return response.internalServerError({ message: 'Logout failed', error: error.message })
    }
  }
}
