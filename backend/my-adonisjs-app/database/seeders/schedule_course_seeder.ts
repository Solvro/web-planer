import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await db.rawQuery(
      'INSERT INTO schedule_courses (schedule_id, course_id) VALUES (1, 1), (1, 2), (2, 2), (3, 1)'
    )
  }
}
