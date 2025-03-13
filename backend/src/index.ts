import { Elysia } from 'elysia'

import { departmentsRoute } from '@/routes/departments'
import { usersRoute } from '@/routes/user'
import cron from '@elysiajs/cron'
import swagger from '@elysiajs/swagger'
import { loggerConfig } from '@/setups/logger'
import { sharedRoute } from '@/routes/shared'
import { scraperScript } from '@/scripts/scraper'
import { notificationsScript } from '@/scripts/notifications'

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
        console.log('🚀 ~ cron ~ scraper')
        notificationsScript()
      },
    })
  )
  .use(swagger())
  .use(loggerConfig)
  .listen(process.env.PORT || 3000)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)
