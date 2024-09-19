import vine from '@vinejs/vine'

export const createScheduleValidator = vine.compile(
  vine.object({
    name: vine.string(),
    userId: vine.number(),
  })
)

export const updateScheduleValidator = vine.compile(
  vine.object({
    name: vine.string(),
  })
)
