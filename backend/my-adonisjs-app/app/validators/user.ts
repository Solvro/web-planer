import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    id: vine
      .string()
      .unique(async (db, value) => !(await db.from('users').where('id', value).first())),
  })
)
