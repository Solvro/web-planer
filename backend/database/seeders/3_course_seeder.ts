import Course from '#models/course'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Course.createMany([
      { id: 'usos.mathematics.com', name: 'Mathematics 101', registrationId: '1' },
      { id: 'usos.physics.com', name: 'Physics 2', registrationId: '2' },
    ])
  }
}
