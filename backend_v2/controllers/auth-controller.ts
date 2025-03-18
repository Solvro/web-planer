import { Users } from '@prisma/client'
import Elysia, { error, t } from 'elysia'

import { prisma } from '@/lib/db'
import { jwtAccessSetup } from '@/setups/jwt'

import { createClient } from '../lib/usos/usos-client'
import { isNotAuthenticated } from '@/middlewares/auth-middleware'
import { getOtpBody, verifyOtpBody } from '@/validators'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'

import { renderToStaticMarkup } from 'react-dom/server'
import OTPEmail from '@/emails/otp'
import { transporter } from '@/lib/email'

export const AuthController = {
  loginWithUsos: new Elysia().use(jwtAccessSetup).post(
    '/login',
    async ({ jwt, cookie: { token }, body }) => {
      const { accessToken, accessSecret } = body

      try {
        const usosClient = createClient({
          token: accessToken,
          secret: accessSecret,
        })

        const profile = await usosClient.get<{
          id: string
          studentNumber: string
          firstName: string
          lastName: string
          photo_urls: Record<string, string>
        }>(
          'users/user?fields=id|student_number|first_name|last_name|photo_urls'
        )

        const existingUser = await prisma.users.findFirst({
          where: { studentNumber: profile.studentNumber },
        })

        let user: Users
        if (existingUser) {
          user = await prisma.users.update({
            where: { id: existingUser.id },
            data: {
              usosId: profile.id,
              firstName: profile.firstName,
              lastName: profile.lastName,
              avatar: profile.photo_urls['50x50'],
              verified: true,
            },
          })
        } else {
          user = await prisma.users.create({
            data: {
              studentNumber: profile.studentNumber,
              usosId: profile.id,
              firstName: profile.firstName,
              lastName: profile.lastName,
              avatar: profile.photo_urls['50x50'],
              verified: true,
              createdAt: new Date(),
            },
          })
        }

        const preparedUser = {
          id: user.id,
          studentNumber: user.studentNumber!,
          usosId: user.usosId,
          firstName: user.firstName!,
          lastName: user.lastName!,
          avatar: user.avatar!,
          verified: user.verified!,
        }

        const value = await jwt.sign(preparedUser)

        token.set({
          value,
          httpOnly: true,
          maxAge: 7 * 86400,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
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
  otpGet: new Elysia().use(getOtpBody).post(
    '/get',
    async ({ body }) => {
      const { email } = body
      const studentNumber = email.split('@')[0]
      let user = await prisma.users.findFirst({
        where: { studentNumber },
      })
      if (user === null) {
        user = await prisma.users.create({
          data: {
            usosId: '',
            studentNumber,
            firstName: '',
            lastName: '',
            avatar: '',
            verified: false,
            createdAt: new Date(),
          },
        })
      }

      const otp = crypto.randomInt(100000, 999999)
      await prisma.users.update({
        where: { id: user.id },
        data: {
          otpCode: otp.toString(),
          otpAttempts: 0,
          otpExpire: DateTime.now().plus({ minutes: 15 }).toJSDate(),
        },
      })

      const html = renderToStaticMarkup(OTPEmail({ otp }))

      await transporter.sendMail({
        from: 'Planer Solvro <planer@solvro.pl>',
        to: email,
        subject: 'Kod weryfikacyjny',
        text: `Twój kod weryfikacyjny to: ${otp}`,
        html,
      })

      return { success: true, message: 'Wysłano kod weryfikacyjny' }
    },
    { body: 'getOtpBody' }
  ),
  otpVerify: new Elysia()
    .use(isNotAuthenticated)
    .use(verifyOtpBody)
    .post(
      '/verify',
      async ({ body, jwt, cookie: { token } }) => {
        const { email, otp } = body
        const studentNumber = email.split('@')[0]

        const user = await prisma.users.findFirst({
          where: { studentNumber, otpExpire: { gt: new Date() } },
        })
        if (user === null) {
          return error(400, {
            success: false,
            message: 'Kod weryfikacyjny wygasł',
          })
        }

        if (user.blocked) {
          return error(401, {
            message:
              'Twoje konto zostało zablokowane na logowanie OTP. Skontaktuj się z administratorem.',
            error: 'User is blocked',
          })
        }

        if (user.otpCode !== otp) {
          const newAttempts = (user.otpAttempts || 0) + 1
          if (newAttempts >= 5) {
            await prisma.users.update({
              where: { id: user.id },
              data: {
                otpAttempts: { increment: 1 },
                blocked: (user.otpAttempts || 0) + 1 >= 5,
                otpExpire: null,
                otpCode: null,
              },
            })

            return error(401, {
              message:
                'Twoje konto zostało zablokowane na logowanie OTP. Skontaktuj się z administratorem.',
              error: 'User is blocked',
            })
          }

          await prisma.users.update({
            where: { id: user.id },
            data: {
              otpAttempts: { increment: 1 },
            },
          })

          return error(400, {
            success: false,
            message: 'Nieprawidłowy kod weryfikacyjny',
          })
        }

        let isNewAccount = false
        if (user.verified === false) {
          isNewAccount = true
        }
        await prisma.users.update({
          where: { id: user.id },
          data: {
            otpExpire: null,
            otpCode: null,
            otpAttempts: 0,
            verified: true,
          },
        })

        const preparedUser = {
          id: user.id,
          studentNumber: user.studentNumber!,
          usosId: user.usosId,
          firstName: user.firstName!,
          lastName: user.lastName!,
          avatar: user.avatar!,
          verified: user.verified!,
        }

        const value = await jwt.sign(preparedUser)

        token.set({
          value,
          httpOnly: true,
          maxAge: 7 * 86400,
          path: '/',
        })

        return { success: true, message: 'Konto zweryfikowane', isNewAccount }
      },
      { body: 'verifyOtpBody' }
    ),
}
