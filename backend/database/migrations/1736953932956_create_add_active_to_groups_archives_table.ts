import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable("groups_archive", (table) => {
      table.boolean("is_active").defaultTo(true);
    });
  }
}
