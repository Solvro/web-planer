import { SharedController } from '@/controllers/shared-controller'
import { createSharedPlanSchema } from '@/validators'
import Elysia, { t } from 'elysia'

export const sharedRoute = new Elysia()

sharedRoute.get(
  '/shared/:id',
  async ({ params }) => SharedController.getOne(params.id),
  { params: t.Object({ id: t.String() }) }
)

sharedRoute
  .guard({ body: createSharedPlanSchema })
  .post('/shared', async ({ body }) => SharedController.create(body))
