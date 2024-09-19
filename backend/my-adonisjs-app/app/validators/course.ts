import vine from '@vinejs/vine'

const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/

export const createCourseValidator = vine.compile(
  vine.object({
    name: vine.string(),
    startTime: vine.string().regex(timeFormat),
    endTime: vine.string().regex(timeFormat),
    group: vine.string(),
    lecturer: vine.string(),
    week: vine.enum(['', 'TP', 'TN']),
    day: vine.string(),
    registrationId: vine.number(),
  })
)
