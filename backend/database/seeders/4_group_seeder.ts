import { BaseSeeder } from "@adonisjs/lucid/seeders";
import db from "@adonisjs/lucid/services/db";

import Group from "#models/group";
import Lecturer from "#models/lecturer";

export default class extends BaseSeeder {
  async run() {
    const resultsGroups = await Group.createMany([
      {
        name: "Czujniki i przetworniki",
        startTime: "11:15:00",
        endTime: "13:00:00",
        group: "1",
        week: "TP",
        day: "poniedziałek",
        type: "L",
        courseId: "W05APR-SI3304LW05-APR-SI-3-25Z",
      },
      {
        name: "Czujniki i przetworniki",
        startTime: "11:15:00",
        endTime: "13:00:00",
        group: "2",
        week: "TN",
        day: "poniedziałek",
        type: "L",
        courseId: "W05APR-SI3304LW05-APR-SI-3-25Z",
      },
      {
        name: "Mechanika i wytrzymałość materiałów",
        startTime: "09:15:00",
        endTime: "11:00:00",
        group: "1",
        week: "TP",
        day: "poniedziałek",
        type: "C",
        courseId: "W10APR-SI2014CW05-APR-SI-3-25Z",
      },
      {
        name: "Mechanika i wytrzymałość materiałów",
        startTime: "09:15:00",
        endTime: "11:00:00",
        group: "2",
        week: "TN",
        day: "poniedziałek",
        type: "C",
        courseId: "W10APR-SI2014CW05-APR-SI-3-25Z",
      },
      {
        name: "Obwody elektryczne i magnetyczne",
        startTime: "11:15:00",
        endTime: "13:00:00",
        group: "1",
        week: "TP",
        day: "poniedziałek",
        type: "C",
        courseId: "W05APR-SI1304CW05-APR-SI-3-25Z",
      },
      {
        name: "Obwody elektryczne i magnetyczne",
        startTime: "11:15:00",
        endTime: "13:00:00",
        group: "2",
        week: "TN",
        day: "poniedziałek",
        type: "C",
        courseId: "W05APR-SI1304CW05-APR-SI-3-25Z",
      },
    ]);

    const resultsLecturers = await Lecturer.createMany([
      {
        name: "Jan",
        surname: "Kowalski",
        averageRating: "4.5",
        opinionsCount: "10",
      },
      {
        name: "Maria",
        surname: "Kowalska",
        averageRating: "4.8",
        opinionsCount: "5",
      },
      {
        name: "Kamil",
        surname: "Gierach",
        averageRating: "4.7",
        opinionsCount: "12",
      },
      {
        name: "Wincenty",
        surname: "Kurzyna",
        averageRating: "4.6",
        opinionsCount: "9",
      },
      {
        name: "Walentyna",
        surname: "Fidos",
        averageRating: "4.9",
        opinionsCount: "6",
      },
      {
        name: "Kazimierz",
        surname: "Motyka",
        averageRating: "4.2",
        opinionsCount: "8",
      },
    ]);

    let i = 0;
    for (const lecturer of resultsLecturers) {
      await db.rawQuery(
        "INSERT INTO group_lecturers (lecturer_id, group_id) VALUES (?, ?)",
        [lecturer.id, resultsGroups[i].id],
      );
      i++;
    }
  }
}
