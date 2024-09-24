import Schedule from '#models/schedule'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Schedule.createMany([{ userId: '123' }, { userId: '234' }, { userId: '123' }])
  }
}
