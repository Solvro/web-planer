import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable("ratings", (table) => {
      table.dropColumn("rate");
      table.double("rating");
    });
  }
}
