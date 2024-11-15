import vine from '@vinejs/vine'

export const createCourseValidator = vine.compile(
  vine.object({
    id: vine
      .string()
      .unique(async (db, value) => !(await db.from('courses').where('id', value).first())),
    name: vine.string(),
    registrationId: vine.string(),
  })
)
