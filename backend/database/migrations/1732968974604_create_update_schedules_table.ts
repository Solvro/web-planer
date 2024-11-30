import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('schedules', (table) => {
      table.increments('id')
      table.integer('user_id').references('users.usos_id').onDelete('CASCADE')
      table.string('name').defaultTo('Nowy plan')
      table.timestamp('created_at').defaultTo('NOW()')
      table.timestamp('updated_at')
    })
  }
}
