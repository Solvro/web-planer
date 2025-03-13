import Elysia, { error } from 'elysia'

import { AuthController } from '@/controllers/auth-controller'
import { updateUserBody } from '@/validators'

import { isAuthenticated } from '@/middlewares/auth-middleware'
import { jwtAccessSetup } from '@/setups/jwt'
import { prisma } from '@/lib/db'
import { usersOtp } from './user-otp'
import { usersSchedules } from './user-schedules'

const protectedRoutes = new Elysia()
  .use(isAuthenticated)
  .use(updateUserBody)
  .get('/', async ({ user }) => {
    const currUser = await prisma.users.findUnique({
      where: { id: user.id },
    })
    if (!currUser) return error(404, { message: 'User not found' })
    return currUser
  })
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
  .get('/logout', async ({ cookie: { token } }) => {
    token.remove()
    return { message: 'Logged out' }
  })

export const usersRoute = (app: Elysia) =>
  app.use(jwtAccessSetup).group('/user', (users) => {
    users.use(AuthController.loginWithUsos)
    users.get('/test', async function handler({ body, set }) {
      return { message: 'Testsss' }
    })
    users.use(protectedRoutes)
    users.use(usersOtp)
    users.use(usersSchedules)
    return users
  })
