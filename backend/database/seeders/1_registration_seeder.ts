import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Registration from "#models/registration";

export default class extends BaseSeeder {
  async run() {
    await Registration.createMany([
      {
        id: "W05-APR-SI-3-25Z",
        name: "W5 zapisy wydziałowe dla kierunku APR SI 3 SEM, 2025/26Z W05-APRP-000P-OSIW7 [W05-APR-SI-3-25Z]",
        departmentId: "W5",
        round: 1,
      },
      {
        id: "W05-APR-SI-3-25Z-T1",
        name: "W5 zapisy wydziałowe dla kierunku APR SI 3 SEM, 2025/26Z W05-APRP-000P-OSIW7 - Tura pierwsza [W05-APR-SI-3-25Z-T1]",
        departmentId: "W5",
        round: 1,
      },
      {
        id: "W05-APR-SI-3-25Z-T2",
        name: "W5 zapisy wydziałowe dla kierunku APR SI 3 SEM, 2025/26Z W05-APRP-000P-OSIW7 - Tura druga [W05-APR-SI-3-25Z-T2]",
        departmentId: "W5",
        round: 1,
      },
    ]);
  }
}
