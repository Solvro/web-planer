import { DateTime } from "luxon";

import { BaseModel, column, manyToMany } from "@adonisjs/lucid/orm";
import type { ManyToMany } from "@adonisjs/lucid/types/relations";

import Group from "#models/group";

import Course from "./course.js";
import Registration from "./registration.js";

export default class Schedule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare userId: number;

  @manyToMany(() => Group, {
    localKey: "id",
    pivotForeignKey: "schedule_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "group_id",
    pivotTable: "schedule_groups",
    pivotTimestamps: true,
  })
  declare groups: ManyToMany<typeof Group>;

  @manyToMany(() => Course, {
    localKey: "id",
    pivotForeignKey: "schedule_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "course_id",
    pivotTable: "schedule_courses",
    pivotTimestamps: true,
  })
  declare courses: ManyToMany<typeof Course>;

  @manyToMany(() => Registration, {
    localKey: "id",
    pivotForeignKey: "schedule_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "registration_id",
    pivotTable: "schedule_registrations",
    pivotTimestamps: true,
  })
  declare registrations: ManyToMany<typeof Registration>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
