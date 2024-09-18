import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Course from '#models/course'
import type { HasMany } from '@adonisjs/lucid/types/relations'
export default class Registration extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare department: string

  @column()
  declare round: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasMany(() => Course)
  declare courses: HasMany<typeof Course>
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
