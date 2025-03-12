import { Elysia } from 'elysia'

import { departmentsRoute } from '@/routes/departments'
import { usersRoute } from '@/routes/user'
import cron from '@elysiajs/cron'
import swagger from '@elysiajs/swagger'
import { loggerConfig } from '@/setups/logger'

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .use(departmentsRoute)
  .use(usersRoute)
  .use(
    cron({
      name: 'scraper',
      // pattern everyday at 01:00
      pattern: '0 1 * * *',
      run() {
        console.log('Run USOS scraper')
      },
    })
  )
  .use(swagger())
  .use(loggerConfig)
  .listen(process.env.PORT || 3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
