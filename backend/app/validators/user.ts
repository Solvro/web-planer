import vine from "@vinejs/vine";

export const createUserValidator = vine.compile(
  vine.object({
    allowNotifications: vine.boolean().optional(),
    avatar: vine.string().optional(),
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
  }),
);
