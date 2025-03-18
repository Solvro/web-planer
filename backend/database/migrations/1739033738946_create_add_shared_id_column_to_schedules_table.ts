import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "schedules";

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("shared_id").defaultTo(null);
    });
  }
}
