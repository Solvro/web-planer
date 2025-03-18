import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "users";

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("avatar").defaultTo(null);
      table.boolean("verified").defaultTo(true);
      table.string("otp_code").defaultTo(null);
      table.integer("otp_attempts").defaultTo(0);
      table.dateTime("otp_expire").defaultTo(null);
      table.boolean("blocked").defaultTo(false);
      table.dropUnique(["usos_id"]);
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("avatar");
      table.dropColumn("verified");
      table.dropColumn("otp_code");
      table.dropColumn("otp_attempts");
      table.dropColumn("otp_expire");
      table.dropColumn("blocked");
      table.unique(["usos_id"]);
    });
  }
}
