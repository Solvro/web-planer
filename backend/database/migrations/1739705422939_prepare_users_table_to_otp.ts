import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "users";

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("avatar").defaultTo(null);
      table.boolean("verified").defaultTo(true);
      table.string("otp_code").defaultTo(null);
      table.dateTime("otp_expire").defaultTo(null);
      table.dropUnique(["usos_id"]);
    });
  }
}
