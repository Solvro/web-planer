import Elysia, { t } from "elysia";

export const updateUserBody = new Elysia().model({
  updateUserBody: t.Object({
    allowNotifications: t.Optional(t.Boolean()),
    avatar: t.Optional(t.String()),
    firstName: t.Optional(t.String()),
    lastName: t.Optional(t.String()),
  }),
});

export const jwtSchema = t.Object({
  id: t.Number(),
  studentNumber: t.String(),
  usosId: t.String(),
  firstName: t.String(),
  lastName: t.String(),
  avatar: t.String(),
  verified: t.Boolean(),
});
