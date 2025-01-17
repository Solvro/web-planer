import { BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";

import { scrapLecturers } from "../app/scrap-lecturers/scrap_lecturers.js";

export default class Lecturers extends BaseCommand {
  static commandName = "lecturers";
  static description = "Scrap lecturers";

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
    staysAlive: false,
  };

  async run() {
    await scrapLecturers();
  }
}
