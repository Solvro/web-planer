import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class UsosAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      await ctx.auth.authenticateUsing(['jwt'])
      await next()
    } catch (error) {
      ctx.response.status(401).send({
        message: 'Authentication failed',
        error: error.message,
      })
    }
  }
}
