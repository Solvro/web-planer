import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "lecturers";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name").nullable();
      table.string("surname").nullable();
      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
