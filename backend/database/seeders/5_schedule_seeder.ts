import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Schedule from "#models/schedule";

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Schedule.createMany([]);
  }
}
