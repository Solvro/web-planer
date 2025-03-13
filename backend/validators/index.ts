import Elysia, { type Static, t } from 'elysia'

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

export const createScheduleSchema = t.Object({
  name: t.String({ minLength: 1 }),
  groups: t.Optional(t.Array(t.Object({ id: t.Number() }))),
  courses: t.Optional(t.Array(t.Object({ id: t.Number() }))),
  registrations: t.Optional(t.Array(t.Object({ id: t.Number() }))),
})
export type createScheduleType = Static<typeof createScheduleSchema>

export const updateScheduleSchema = t.Intersect([
  createScheduleSchema,
  t.Object({
    name: t.Optional(t.String({ minLength: 1 })),
    sharedId: t.Optional(t.String({ minLength: 1 })),
    updatedAt: t.Optional(t.String({ minLength: 1 })),
  }),
])
export type updateScheduleType = Static<typeof updateScheduleSchema>

export const createSharedPlanSchema = t.Object({
  id: t.String({ minLength: 1 }),
  plan: t.String({ minLength: 1 }),
})
export type createSharedPlanType = Static<typeof createSharedPlanSchema>
