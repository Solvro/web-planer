import { BaseSchema } from "@adonisjs/lucid/schema";

export default class UpdateCourseIdForeignKey extends BaseSchema {
  protected tableName = "groups";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(["course_id"]); // Remove the existing foreign key
      table
        .foreign("course_id")
        .references("courses.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(["course_id"]); // Remove the modified foreign key
      table.foreign("course_id").references("courses.id").onDelete("CASCADE"); // Revert to original
    });
  }
}
