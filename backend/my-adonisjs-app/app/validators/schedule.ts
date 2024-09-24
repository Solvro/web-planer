import vine from '@vinejs/vine'

export const createScheduleValidator = vine.compile(
  vine.object({
    name: vine.string(),
    userId: vine.string(),
  })
)

export const updateScheduleValidator = vine.compile(
  vine.object({
    name: vine.string(),
  })
)
