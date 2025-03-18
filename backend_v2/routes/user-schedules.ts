import { SchedulesController } from '@/controllers/schedules-controller'
import { isAuthenticated } from '@/middlewares/auth-middleware'
import { createScheduleSchema, updateScheduleSchema } from '@/validators'
import Elysia, { t } from 'elysia'

export const usersSchedules = new Elysia({ prefix: '/schedules' })
  .use(isAuthenticated)
  .get('/', async ({ user }) => SchedulesController.getAll(user.id))
  .get(
    '/:schedule_id',
    async ({ user, params }) =>
      SchedulesController.getOne(user.id, params.schedule_id),
    { params: t.Object({ schedule_id: t.String({ minLength: 1 }) }) }
  )
  .use(
    new Elysia()
      .use(isAuthenticated)
      .guard({ body: createScheduleSchema })
      .post('/', async ({ user, body }) =>
        SchedulesController.create(user.id, body)
      )
  )
  .use(
    new Elysia()
      .use(isAuthenticated)
      .guard({
        params: t.Object({ schedule_id: t.Number() }),
        body: updateScheduleSchema,
      })
      .patch('/:schedule_id', async ({ user, body, params }) =>
        SchedulesController.updateOne(
          user.id,
          params.schedule_id.toString(),
          body
        )
      )
  )
  .delete(
    '/:schedule_id',
    async ({ user, params }) =>
      SchedulesController.deleteOne(user.id, params.schedule_id),
    { params: t.Object({ schedule_id: t.String({ minLength: 1 }) }) }
  )
