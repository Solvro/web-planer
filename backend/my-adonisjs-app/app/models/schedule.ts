import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Course from '#models/course'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Schedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare userId: number

  @manyToMany(() => Course, {
    localKey: 'id',
    pivotForeignKey: 'schedule_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'course_id',
    pivotTable: 'schedule_courses',
    pivotTimestamps: true,
  })
  declare courses: ManyToMany<typeof Course>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
