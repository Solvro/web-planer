import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
export default class Group extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare startTime: string

  @column()
  declare endTime: string

  @column()
  declare group: string

  @column()
  declare lecturer: string

  @column()
  declare week: '' | 'TP' | 'TN'

  @column()
  declare day: string

  @column()
  declare type: string

  @column()
  declare courseId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
