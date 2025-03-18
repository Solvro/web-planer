import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Course from "#models/course";

export default class extends BaseSeeder {
  async run() {
    await Course.createMany([
      {
        id: "usos.mathematics.com",
        name: "Mathematics 101",
        registrationId: "1",
      },
      { id: "usos.physics.com", name: "Physics 2", registrationId: "2" },
      { id: "usos.chemistry.com", name: "Chemistry 101", registrationId: "3" },
      { id: "usos.biology.com", name: "Biology 101", registrationId: "1" },
      { id: "usos.history.com", name: "History 101", registrationId: "2" },
      { id: "usos.geography.com", name: "Geography 101", registrationId: "3" },
    ]);
  }
}
