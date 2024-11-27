import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class UsosAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      console.log('Authenticating...')
      const token = ctx.request.cookie('token')
      console.log(token)
      await ctx.auth.authenticateUsing(['jwt'])
      console.log('Authenticated user:', ctx.auth.user)
      await next()
    } catch (error) {
      ctx.response.status(401).send({
        message: 'Authentication failed',
        error: error.message,
      })
    }
  }
}
