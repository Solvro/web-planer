import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "courses";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string("id").primary();
      table.string("name");
      table
        .string("registration_id")
        .references("registrations.id")
        .onDelete("CASCADE");
      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
