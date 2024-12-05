import vine from '@vinejs/vine'

export const createScheduleValidator = vine.compile(
  vine.object({
    name: vine.string(),
  })
)

export const updateScheduleValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    groups: vine
      .array(
        vine.object({
          id: vine.number(),
        })
      )
      .optional(),
    courses: vine
      .array(
        vine.object({
          id: vine.string(),
        })
      )
      .optional(),
    registrations: vine
      .array(
        vine.object({
          id: vine.string(),
        })
      )
      .optional(),
  })
)
