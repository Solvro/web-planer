import { DateTime } from "luxon";

import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";

import Schedule from "#models/schedule";

const AuthFinder = withAuthFinder(() => hash.use("scrypt"), {
  uids: ["id"],
  passwordColumnName: "password",
});

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare usosId: string;
  @column()
  declare firstName: string;
  @column()
  declare lastName: string;
  @column()
  declare studentNumber: string;
  @column()
  declare allowNotifications: boolean;

  @hasMany(() => Schedule)
  declare schedules: HasMany<typeof Schedule>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  public getId() {
    return this.id;
  }
  public getOriginal() {
    return this;
  }
}
