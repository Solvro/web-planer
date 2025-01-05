import { DateTime } from "luxon";

import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";

import Rating from "./rating.js";

export default class Lecturer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare surname: string;

  @column()
  declare averageRating: string;

  @hasMany(() => Rating)
  declare ratings: HasMany<typeof Rating>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
