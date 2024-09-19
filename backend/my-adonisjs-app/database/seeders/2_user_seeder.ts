import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { DateTime } from 'luxon'
export default class extends BaseSeeder {
  async run() {
    await User.createMany([{ updatedAt: DateTime.now() }, { updatedAt: DateTime.now() }])
  }
}
