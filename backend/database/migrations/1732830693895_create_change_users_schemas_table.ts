import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable("users", (table) => {
      table.string("usos_id").notNullable().unique();
      table.string("first_name");
      table.string("last_name");
      table.string("student_number");
      table.dropColumn("full_name");
      table.dropColumn("email");
      table.dropColumn("password");
    });
  }
}
