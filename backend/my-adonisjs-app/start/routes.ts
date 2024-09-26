/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const SessionController = () => import('#controllers/session_controller')
const UsersController = () => import('#controllers/users_controller')
const SchedulesController = () => import('#controllers/schedules_controller')
const RegistrationsController = () => import('#controllers/registrations_controller')
const CoursesController = () => import('#controllers/courses_controller')
const GroupsController = () => import('#controllers/groups_controller')

router.resource('users', UsersController).apiOnly()
router
  .resource('users.schedules', SchedulesController)
  .apiOnly()
  .use(['index', 'destroy', 'show', 'store', 'update'], middleware.auth())
router.resource('registrations', RegistrationsController).apiOnly()
router.resource('registrations.courses', CoursesController).apiOnly()
router.resource('registrations.courses.groups', GroupsController).apiOnly()
router.post('/login', [SessionController, 'store'])
