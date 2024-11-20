import { HttpContext } from '@adonisjs/core/http'
import { createClient } from '../usos/usos_client.js'

export default class SessionController {
  async store({ request, response }: HttpContext) {
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
      return { message: 'User logged in.', firstName: profile.first_name }
    } catch (error) {
      return response.unauthorized({ accessToken, accessSecret })
    }

  }
}
