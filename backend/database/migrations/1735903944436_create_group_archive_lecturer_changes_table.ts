import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable("groups_archive", (table) => {
      table.integer("spots_occupied").defaultTo(0);
      table.integer("spots_total").defaultTo(0);
      table.dropColumn("lecturer");
    });
  }
}
