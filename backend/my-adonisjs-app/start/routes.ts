/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const SchedulesController = () => import('#controllers/schedules_controller')
const RegistrationsController = () => import('#controllers/registrations_controller')
const CoursesController = () => import('#controllers/courses_controller')

router.resource('users', UsersController).apiOnly()
router.resource('users.schedules', SchedulesController).apiOnly()
router.resource('registrations.courses', CoursesController).apiOnly()
router.resource('registrations', RegistrationsController).apiOnly()
