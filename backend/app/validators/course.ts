import vine from '@vinejs/vine'

export const createCourseValidator = vine.compile(
  vine.object({
    id: vine.string(),
    name: vine.string(),
    registrationId: vine.string(),
  })
)
