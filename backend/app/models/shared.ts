import { DateTime } from "luxon";

import { BaseModel, column } from "@adonisjs/lucid/orm";

export default class Shared extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare plan: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
