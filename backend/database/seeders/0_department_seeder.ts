import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Department from "#models/department";

export default class extends BaseSeeder {
  async run() {
    await Department.createMany([
      {
        id: "W1",
        name: "W1",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=W1",
      },
      {
        id: "W2",
        name: "W2",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=W2",
      },
      {
        id: "W3",
        name: "W3",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=W3",
      },
      {
        id: "W4N",
        name: "W4N",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=W4N",
      },
      {
        id: "W5",
        name: "W5",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=W5",
      },
      {
        id: "W6",
        name: "W6",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=W6",
      },
    ]);
  }
}
