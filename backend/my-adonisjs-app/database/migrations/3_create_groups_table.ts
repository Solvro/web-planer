import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'groups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.time('start_time')
      table.time('end_time')
      table.string('group')
      table.string('lecturer')
      table.enum('week', ['', 'TN', 'TP'])
      table.text('day')
      table.text('type')
      table.integer('course_id').references('courses.id').onDelete('CASCADE')
      table.timestamp('created_at').defaultTo('NOW()')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
