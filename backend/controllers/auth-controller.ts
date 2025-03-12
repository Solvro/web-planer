import { users } from '@prisma/client'
import Elysia, { t } from 'elysia'

import { prisma } from '@/lib/db'
import { jwtAccessSetup } from '@/setups/jwt'

import { createClient } from '../lib/usos/usos-client'

export const AuthController = {
  loginWithUsos: new Elysia().use(jwtAccessSetup).post(
    '/login',
    async ({ jwt, cookie: { auth }, body }) => {
      const { accessToken, accessSecret } = body

      try {
        const usosClient = createClient({
          token: accessToken,
          secret: accessSecret,
        })

        const profile = await usosClient.get<{
          id: string
          student_number: string
          first_name: string
          last_name: string
          photo_urls: Record<string, string>
        }>(
          'users/user?fields=id|student_number|first_name|last_name|photo_urls'
        )

        const existingUser = await prisma.users.findFirst({
          where: { student_number: profile.student_number },
        })

        let user: users
        if (existingUser) {
          user = await prisma.users.update({
            where: { id: existingUser.id },
            data: {
              usos_id: profile.id,
              first_name: profile.first_name,
              last_name: profile.last_name,
              avatar: profile.photo_urls['50x50'],
              verified: true,
            },
          })
        } else {
          user = await prisma.users.create({
            data: {
              student_number: profile.student_number,
              usos_id: profile.id,
              first_name: profile.first_name,
              last_name: profile.last_name,
              avatar: profile.photo_urls['50x50'],
              verified: true,
              created_at: new Date(),
            },
          })
        }

        const preparedUser = {
          id: user.id,
          studentNumber: user.student_number!,
          usosId: user.usos_id,
          firstName: user.first_name!,
          lastName: user.last_name!,
          avatar: user.avatar!,
          verified: user.verified!,
        }

        const value = await jwt.sign(preparedUser)

        auth.set({
          value,
          httpOnly: true,
          maxAge: 7 * 86400,
          path: '/',
        })

        return preparedUser
      } catch (error) {
        console.error('🚀 ~ login: ~ error:', error)
        return error
      }
    },
    {
      body: t.Object({ accessToken: t.String(), accessSecret: t.String() }),
    }
  ),
  logout: async () => {
    try {
      return {
        data: [],
        message: 'User logged out',
      }
    } catch (error) {
      console.log('🚀 ~ getDepartments: ~ error:', error)
      return {
        data: [],
        message: 'Failed to logout',
      }
    }
  },
}
