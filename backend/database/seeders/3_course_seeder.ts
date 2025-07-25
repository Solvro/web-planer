import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Course from "#models/course";

export default class extends BaseSeeder {
  async run() {
    await Course.createMany([
      {
        id: "W05APR-SI3304LW05-APR-SI-3-25Z",
        name: "Czujniki i przetworniki",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05APR-SI3304WW05-APR-SI-3-25Z",
        name: "Czujniki i przetworniki",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W10APR-SI2014CW05-APR-SI-3-25Z",
        name: "Mechanika i wytrzymałość materiałów",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W10APR-SI2014WW05-APR-SI-3-25Z",
        name: "Mechanika i wytrzymałość materiałów",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05APR-SI1304CW05-APR-SI-3-25Z",
        name: "Obwody elektryczne i magnetyczne",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05APR-SI1304WW05-APR-SI-3-25Z",
        name: "Obwody elektryczne i magnetyczne",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05APR-SI3303LW05-APR-SI-3-25Z",
        name: "Podstawy elektroniki 2",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05APR-SI1201LW05-APR-SI-3-25Z",
        name: "Podstawy inżynierii materiałowej",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05APR-SI1201WW05-APR-SI-3-25Z",
        name: "Podstawy inżynierii materiałowej",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05APR-SI3238LW05-APR-SI-3-25Z",
        name: "Podstawy techniki mikroprocesorowej 1",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05APR-SI3238WW05-APR-SI-3-25Z",
        name: "Podstawy techniki mikroprocesorowej 1",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05APR-SI2301WW05-APR-SI-3-25Z",
        name: "Urządzenia i stacje",
        registrationId: "W05-APR-SI-3-25Z",
      },
    ]);
  }
}
