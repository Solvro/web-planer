import { DateTime } from "luxon";

import { BaseModel, column, hasMany, manyToMany } from "@adonisjs/lucid/orm";
import type { HasMany, ManyToMany } from "@adonisjs/lucid/types/relations";

import GroupMeeting from "./group_meeting.js";
import Lecturer from "./lecturer.js";

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare group: string;

  @manyToMany(() => Lecturer, {
    localKey: "id",
    pivotForeignKey: "group_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "lecturer_id",
    pivotTable: "group_lecturers",
    pivotTimestamps: true,
  })
  declare lecturers: ManyToMany<typeof Lecturer>;

  @column()
  declare type: string;

  @column()
  declare courseId: string;

  @column()
  declare url: string;

  @column()
  declare spotsOccupied: number;

  @column()
  declare spotsTotal: number;
  @column()
  declare isActive: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @hasMany(() => GroupMeeting)
  declare meetings: HasMany<typeof GroupMeeting>;
}
