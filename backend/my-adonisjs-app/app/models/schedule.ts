import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Group from '#models/group'

export default class Schedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare userId: string

  @manyToMany(() => Group, {
    localKey: 'id',
    pivotForeignKey: 'schedule_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'group_id',
    pivotTable: 'schedule_groups',
    pivotTimestamps: true,
  })
  declare courses: ManyToMany<typeof Group>
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
