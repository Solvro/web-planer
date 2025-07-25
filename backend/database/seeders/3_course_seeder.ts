import { BaseSeeder } from "@adonisjs/lucid/seeders";

import Course from "#models/course";

export default class extends BaseSeeder {
  async run() {
    await Course.createMany([
      {
        id: "W05AFR-SI3304LW05-APR-SI-3-25Z",
        name: "Czujniki i przetworniki",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05APR-SI3304WW05-APR-SI-3-25Z",
        name: "Czujniki i przetworniki",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W10AFR-SI2014CW05-APR-SI-3-25Z",
        name: "Mechanika i wytrzymałość materiałów",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W10AFR-SI2014WW05-APR-SI-3-25Z",
        name: "Mechanika i wytrzymałość materiałów",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05AFR-SI1304CW05-APR-SI-3-25Z",
        name: "Obwody elektryczne i magnetyczne",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05AFR-SI1304WW05-APR-SI-3-25Z",
        name: "Obwody elektryczne i magnetyczne",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05AFR-SI2003LW05-APR-SI-3-25Z",
        name: "Podstawy elektroniki",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05AFR-SI1201LW05-APR-SI-3-25Z",
        name: "Podstawy inżynierii materiałowej",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05AFR-SI1201WW05-APR-SI-3-25Z",
        name: "Podstawy inżynierii materiałowej",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05AFR-SI3238LW05-APR-SI-3-25Z",
        name: "Podstawy techniki mikroprocesorowej 1",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05AFR-SI3238WW05-APR-SI-3-25Z",
        name: "Podstawy techniki mikroprocesorowej 1",
        registrationId: "W05-APR-SI-3-25Z",
      },
      {
        id: "W05AFR-SI2001WW05-APR-SI-3-25Z",
        name: "Urządzenia i stacje",
        registrationId: "W05-APR-SI-3-25Z",
      },
    ]);
  }
}
