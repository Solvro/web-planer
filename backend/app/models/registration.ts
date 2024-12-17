import { DateTime } from "luxon";

import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";

import Course from "#models/group";

export default class Registration extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare departmentId: string;

  @column()
  declare round: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @hasMany(() => Course)
  declare courses: HasMany<typeof Course>;
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
