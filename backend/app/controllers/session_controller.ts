import { HttpContext } from '@adonisjs/core/http'
import { createClient } from '../usos/usos_client.js'
import User from '#models/user'

export default class SessionController {
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
        'users/user?fields=id|student_number|first_name|last_name',
        {
          shouldCache: false, // Nie używamy cache dla tego zapytania
        }
      )
      let user = await User.findBy('usos_id', profile.id)
      if (!user) {
        user = await User.create({
          usos_id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          student_number: profile.student_number,
          access_token: accessToken,
          access_secret: accessSecret,
        })
      } else {
        user.accessToken = accessToken
        user.accessSecret = accessSecret
        await user.save()
      }
      const token = await auth.use('jwt').generate(user)

      return response.ok({
        token: token,
        ...user.serialize(),
      })
    } catch (error) {
      return response.unauthorized({ message: 'Login failed.', error: error.message })
    }
  }
}
