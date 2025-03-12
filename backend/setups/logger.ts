import { logger } from '@bogeychan/elysia-logger'

export const loggerConfig = logger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
})
