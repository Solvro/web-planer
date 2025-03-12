import Elysia, { t } from 'elysia'

export const updateUserBody = new Elysia().model({
  updateUserBody: t.Object({
    allowNotifications: t.Optional(t.Boolean()),
    avatar: t.Optional(t.String({ minLength: 1 })),
    firstName: t.Optional(t.String({ minLength: 1 })),
    lastName: t.Optional(t.String({ minLength: 1 })),
  }),
})

export const getOtpBody = new Elysia().model({
  getOtpBody: t.Object({
    email: t.String({ minLength: 1 }),
  }),
})

export const verifyOtpBody = new Elysia().model({
  verifyOtpBody: t.Object({
    email: t.String({ minLength: 1 }),
    otp: t.String({ minLength: 6, maxLength: 6 }),
  }),
})

export const jwtSchema = t.Object({
  id: t.Number(),
  studentNumber: t.String(),
  usosId: t.String(),
  firstName: t.String(),
  lastName: t.String(),
  avatar: t.String(),
  verified: t.Boolean(),
})
