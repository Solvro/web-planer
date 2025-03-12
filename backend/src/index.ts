import { Elysia } from 'elysia'

import { RouteDepartments } from '../routes/departments'
import { RouteUsers } from '../routes/user'
import cron, { Patterns } from '@elysiajs/cron'

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .use(RouteDepartments)
  .use(RouteUsers)
  .use(
    cron({
      name: 'scraper',
      pattern: Patterns.everyDayAt('01:00'),
      run() {
        console.log('Run USOS scraper')
      },
    })
  )
  .listen(process.env.PORT || 3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
