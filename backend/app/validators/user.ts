import vine from "@vinejs/vine";

export const createUserValidator = vine.compile(
  vine.object({
    id: vine.string().unique(
      async (db, value) =>
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        !(await db.from("users").where("id", value).first()),
    ),
  }),
);
