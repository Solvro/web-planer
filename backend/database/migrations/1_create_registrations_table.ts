import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "registrations";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string("id").primary();
      table.string("name");
      table
        .string("department_id")
        .references("departments.id")
        .onDelete("CASCADE");
      table.integer("round");
      table.timestamp("created_at").defaultTo("NOW()");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
