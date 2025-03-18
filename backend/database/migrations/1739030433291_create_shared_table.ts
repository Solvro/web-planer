import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "shareds";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table.text("plan", "longtext");

      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
