import vine from "@vinejs/vine";

export const createUserValidator = vine.compile(
  vine.object({
    allowNotifications: vine.boolean(),
  }),
);
