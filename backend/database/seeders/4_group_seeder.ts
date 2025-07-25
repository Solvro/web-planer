import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Group from "#models/group";
import GroupArchive from "#models/group_archive";

export default class extends BaseSeeder {
  async run() {
    await Group.createMany([
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
    await GroupArchive.createMany([
      {
        name: "Mathematics 101",
        startTime: "09:15:00",
        endTime: "11:00:00",
        group: "1",
        week: "TN",
        day: "Monday",
        type: "L",
        courseId: "usos.mathematics.com",
      },
      {
        name: "Physics 202",
        startTime: "11:15:00",
        endTime: "13:00:00",
        group: "7",
        week: "-",
        day: "Wednesday",
        type: "W",
        courseId: "usos.chemistry.com",
      },
      {
        name: "Chemistry 303",
        startTime: "13:15:00",
        endTime: "15:00:00",
        group: "3",
        week: "TN",
        day: "Friday",
        type: "L",
        courseId: "usos.chemistry.com",
      },
      {
        name: "Biology 404",
        startTime: "15:15:00",
        endTime: "17:00:00",
        group: "2",
        week: "-",
        day: "Tuesday",
        type: "W",
        courseId: "usos.biology.com",
      },
      {
        name: "Computer Science 505",
        startTime: "17:15:00",
        endTime: "19:00:00",
        group: "5",
        week: "TN",
        day: "Thursday",
        type: "L",
        courseId: "usos.mathematics.com",
      },
    ]);
  }
}
