import { DateTime } from "luxon";

import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

import GroupArchive from "./group_archive.js";

export default class GroupArchiveMeeting extends BaseModel {
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

  @belongsTo(() => GroupArchive)
  declare group: BelongsTo<typeof GroupArchive>;
}
