import vine from "@vinejs/vine";

export const createSharedValidator = vine.compile(
  vine.object({
    id: vine.string(),
    plan: vine.string(),
  }),
);
