import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable("lecturers", (table) => {
      table.string("average_rating");
    });
  }
}
