import jwt from '@elysiajs/jwt'
import Elysia, { t } from 'elysia'

import { jwtSchema } from '@/validators'

export const jwtAccessSetup = new Elysia({
  name: 'jwtAccess',
}).use(
  jwt({
    name: 'jwt',
    schema: jwtSchema,
    secret: process.env.APP_KEY!,
    exp: '7d',
  })
)
