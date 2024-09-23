import vine from '@vinejs/vine'

export const createCourseValidator = vine.compile(
  vine.object({
    name: vine.string(),
    registrationId: vine.number(),
  })
)
