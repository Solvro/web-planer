import type { Elysia } from 'elysia'

import { jwtAccessSetup } from '../setups/jwt'

export const isAuthenticated = (app: Elysia) =>
  app.use(jwtAccessSetup).derive(async function handler({
    jwt,
    cookie: { token },
    error,
  }) {
    const user = await jwt.verify(token.value)
    if (!user) {
      return error(401, 'Unauthorized')
    }

    return { user }
  })

export const isNotAuthenticated = (app: Elysia) =>
  app.use(jwtAccessSetup).derive(async function handler({
    cookie: { token },
    error,
  }) {
    if (token.value) {
      return error(401, 'Unauthorized')
    }

    return {}
  })
