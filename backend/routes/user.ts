import Elysia, { error } from 'elysia'

import { AuthController } from '@/controllers/auth-controller'
import { updateUserBody } from '@/validators'

import { isAuthenticated } from '../middlewares/auth-middleware'
import { jwtAccessSetup } from '../setups/jwt'
import { prisma } from '@/lib/db'
import { usersOtp } from './user-otp'

export const RouteUsers = (app: Elysia) =>
  app.use(jwtAccessSetup).group('/user', (users) => {
    users.use(AuthController.loginWithUsos)
    users.use(isAuthenticated).get('/', async ({ user }) => {
      const currUser = await prisma.users.findUnique({
        where: { id: user.id },
      })
      if (!currUser) return error(404, { message: 'User not found' })
      return currUser
    })
    users
      .use(updateUserBody)
      .use(isAuthenticated)
      .post(
        '/',
        async ({ body, user }) => {
          const userId = user.id
          const currUser = await prisma.users.findUnique({
            where: { id: userId },
          })
          if (!currUser) return error(404, { message: 'User not found' })

          await prisma.users.update({
            where: { id: userId },
            data: {
              ...body,
            },
          })
          return {
            message: 'User updated successfully',
            user: userId,
            success: true,
          }
        },
        { body: 'updateUserBody' }
      )
    users.use(isAuthenticated).get('/logout', async ({ cookie: { auth } }) => {
      auth.remove()
      return { message: 'Logged out' }
    })

    users.use(usersOtp)

    users
      .use(isAuthenticated)
      .get('/test', async function handler({ body, set, user }) {
        return { message: 'Testsss', user }
      })

    return users
  })
