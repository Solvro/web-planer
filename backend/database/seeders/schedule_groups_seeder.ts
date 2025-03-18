import { BaseSeeder } from "@adonisjs/lucid/seeders";
import db from "@adonisjs/lucid/services/db";

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await db.rawQuery(
      "INSERT INTO schedule_groups (schedule_id, group_id) VALUES (1, 1), (1, 2)",
    );
  }
}
