import Course from '#models/course'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Course.createMany([
      {
        name: 'Mathematics 101',
        startTime: '09:15:00',
        endTime: '11:00:00',
        group: '1',
        lecturer: 'John Doe',
        week: 'TN',
        day: 'Monday',
        type: 'L',
        registrationId: 1,
      },
      {
        name: 'Physics 202',
        startTime: '11:15:00',
        endTime: '13:00:00',
        group: '7',
        lecturer: 'Billu The Goat',
        week: '',
        day: 'Wednesday',
        type: 'W',
        registrationId: 1,
      },
    ])
  }
}
