import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable("lecturers", (table) => {
      table.string("opinions_count").defaultTo("0").alter();
      table.string("average_rating").defaultTo("0.00").alter();
    });
  }
}
