/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

import router from '@adonisjs/core/services/router'
// import { middleware } from './kernel.js'
const DepartmentsController = () => import('#controllers/departments_controller')
const SessionController = () => import('#controllers/session_controller')
const UsersController = () => import('#controllers/users_controller')
const SchedulesController = () => import('#controllers/schedules_controller')
const ScheduleGroupsController = () => import('#controllers/schedule_groups_controller')
const RegistrationsController = () => import('#controllers/registrations_controller')
const CoursesController = () => import('#controllers/courses_controller')
const GroupsController = () => import('#controllers/groups_controller')

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
  // return AutoSwagger.default.scalar("/swagger"); to use Scalar instead
  // return AutoSwagger.default.rapidoc("/swagger", "view"); to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
})

router.resource('users', UsersController).apiOnly()
router.resource('users.schedules', SchedulesController).apiOnly()
router.resource('departments', DepartmentsController).apiOnly()
router.resource('departments.registrations', RegistrationsController).apiOnly()
router.resource('departments.registrations.courses', CoursesController).apiOnly()
router.resource('departments.registrations.courses.groups', GroupsController).apiOnly()
router.post('/login', [SessionController, 'store'])
router.get('/users/:user_id/schedules/:schedule_id/groups', [ScheduleGroupsController, 'index'])
router.post('/users/:user_id/schedules/:schedule_id/groups', [ScheduleGroupsController, 'store'])
router.delete('/users/:user_id/schedules/:schedule_id/groups/:group_id', [
  ScheduleGroupsController,
  'destroy',
])
