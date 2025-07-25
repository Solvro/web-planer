import { BaseSeeder } from "@adonisjs/lucid/seeders";

import User from "#models/user";
import env from "#start/env";

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        usosId: "123456",
        firstName: "Testowy",
        lastName: "User",
        studentNumber: env.get("TEST_EMAIL", "").split("@")[0],
        verified: true,
        blocked: false,
      },
    ]);
  }
}
