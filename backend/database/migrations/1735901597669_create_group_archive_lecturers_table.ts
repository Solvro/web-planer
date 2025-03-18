import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "group_archive_lecturers";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("lecturer_id")
        .references("lecturers.id")
        .onDelete("CASCADE");
      table
        .integer("group_id")
        .references("groups_archive.id")
        .onDelete("CASCADE");
      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
