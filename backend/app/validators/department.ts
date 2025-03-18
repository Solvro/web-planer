import vine from "@vinejs/vine";

export const createDepartmentValidator = vine.compile(
  vine.object({
    id: vine.string(),
    name: vine.string(),
    url: vine.string(),
  }),
);
