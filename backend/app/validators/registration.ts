import vine from "@vinejs/vine";

export const createRegistrationValidator = vine.compile(
  vine.object({
    id: vine.string(),
    name: vine.string(),
    departmentId: vine.string(),
    round: vine.number(),
  }),
);
