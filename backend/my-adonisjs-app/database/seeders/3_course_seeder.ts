import Course from '#models/course'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Course.createMany([
      { name: 'Mathematics 101', registrationId: 1 },
      { name: 'Physics 202', registrationId: 2 },
    ])
  }
}
