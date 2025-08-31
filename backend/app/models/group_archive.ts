import { DateTime } from "luxon";

import { BaseModel, column, hasMany, manyToMany } from "@adonisjs/lucid/orm";
import type { HasMany, ManyToMany } from "@adonisjs/lucid/types/relations";

import GroupArchiveMeeting from "./group_archive_meeting.js";
import Lecturer from "./lecturer.js";

export default class GroupArchive extends BaseModel {
  static table = "groups_archive";
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
    pivotTable: "group_archive_lecturers",
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

  @hasMany(() => GroupArchiveMeeting)
  declare meetings: HasMany<typeof GroupArchiveMeeting>;
}
