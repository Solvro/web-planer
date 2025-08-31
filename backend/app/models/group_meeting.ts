import { DateTime } from "luxon";

import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import Group from "./group.js";

export default class GroupMeeting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare groupId: number;

  @column()
  declare startTime: string;

  @column()
  declare endTime: string;

  @column()
  declare week: "-" | "TP" | "TN" | "!";

  @column()
  declare day: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => Group)
  declare group: BelongsTo<typeof Group>;
}
