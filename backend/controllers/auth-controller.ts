import { users } from '@prisma/client'
import Elysia, { t } from 'elysia'

import { prisma } from '@/lib/db'
import { jwtAccessSetup } from '@/setups/jwt'

import { createClient } from '../lib/usos/usos-client'
import { isNotAuthenticated } from '@/middlewares/auth-middleware'
import { getOtpBody, verifyOtpBody } from '@/validators'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'

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
  otpGet: new Elysia()
    .use(isNotAuthenticated)
    .use(getOtpBody)
    .post(
      '/get',
      async ({ body }) => {
        const { email } = body
        const student_number = email.split('@')[0]
        let user = await prisma.users.findFirst({
          where: { student_number },
        })
        if (user === null) {
          user = await prisma.users.create({
            data: {
              usos_id: '',
              student_number,
              first_name: '',
              last_name: '',
              avatar: '',
              verified: false,
              created_at: new Date(),
            },
          })
        }

        const otp = crypto.randomInt(100000, 999999).toString()
        await prisma.users.update({
          where: { id: user.id },
          data: {
            otp_code: otp,
            otp_attempts: 0,
            otp_expire: DateTime.now().plus({ minutes: 15 }).toJSDate(),
          },
        })

        // send mail

        return { success: true, message: 'Wysłano kod weryfikacyjny' }
      },
      { body: 'getOtpBody' }
    ),
  otpVerify: new Elysia()
    .use(isNotAuthenticated)
    .use(verifyOtpBody)
    .post(
      '/verify',
      async ({ body }) => {
        const { email, otp } = body
      },
      { body: 'verifyOtpBody' }
    ),
}
