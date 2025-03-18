import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "group_lecturer_changes";

  async up() {
    this.schema.alterTable("groups", (table) => {
      table.dropColumn("lecturer");
    });
  }
}
