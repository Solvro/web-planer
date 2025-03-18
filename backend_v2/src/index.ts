import { Elysia } from 'elysia'

import { departmentsRoute } from '@/routes/departments'
import { usersRoute } from '@/routes/user'
import cron from '@elysiajs/cron'
import swagger from '@elysiajs/swagger'
import { sharedRoute } from '@/routes/shared'
import { scraperScript } from '@/scripts/scraper'
import { notificationsScript } from '@/scripts/notifications'
import cors from '@elysiajs/cors'

const CORS_DOMAINS = process.env.CORS_ORIGIN?.split(',') || [
  'https://planer.solvro.pl',
]

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .use(departmentsRoute)
  .use(usersRoute)
  .use(sharedRoute)
  .use(
    cron({
      name: 'scraper',
      // pattern everyday at 01:00
      pattern: '0 1 * * *',
      run() {
        console.log('🚀 ~ cron ~ scraper')
        scraperScript()
      },
    })
  )
  .use(
    cron({
      name: 'notifications',
      // pattern everyday at 01:30
      pattern: '30 1 * * *',
      run() {
        console.log('🚀 ~ cron ~ notifications')
        notificationsScript()
      },
    })
  )
  .use(swagger())
  .use(
    cors({
      origin: CORS_DOMAINS,
    })
  )
  .listen(process.env.PORT || 3000)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)
