import vine from '@vinejs/vine'

export const createRegistrationValidator = vine.compile(
  vine.object({
    name: vine.string(),
    department: vine.string(),
    round: vine.number(),
  })
)
