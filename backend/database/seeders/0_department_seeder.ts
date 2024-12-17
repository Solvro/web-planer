import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Department from "#models/department";

export default class extends BaseSeeder {
  async run() {
    await Department.createMany([
      {
        id: "W01-ABC-XY-1",
        name: "Department of Computer Science",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=CS",
      },
      {
        id: "W02-DEF-ZY-2",
        name: "Department of Mathematics",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=MATH",
      },
      {
        id: "W03-GHI-WX-3",
        name: "Department of Physics",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=PHYS",
      },
      {
        id: "W04-JKL-VU-4",
        name: "Department of Chemistry",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=CHEM",
      },
      {
        id: "W05-MNO-TS-5",
        name: "Department of Biology",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=BIO",
      },
      {
        id: "W06-PQR-RQ-6",
        name: "Department of Engineering",
        url: "https://web.usos.pwr.edu.pl/kontroler.php?_action=news/rejestracje/rejJednostki&jed_org_kod=ENG",
      },
    ]);
  }
}
