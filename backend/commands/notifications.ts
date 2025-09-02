import { BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import mail from "@adonisjs/mail/services/main";

import Group from "#models/group";
import GroupArchive from "#models/group_archive";
import GroupMeeting from "#models/group_meeting";
import Schedule from "#models/schedule";

async function sendEmail(userNotifications: Map<string, string[]>) {
  for (const studentNumber of userNotifications.keys()) {
    const notificationsList = userNotifications.get(studentNumber);
    if (notificationsList !== undefined) {
      const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #0056b3;">Nastąpiły zmiany w blokach zajęciowych</h2>
      ${notificationsList.map((notification) => `<p style="color: #333; margin: 10px 0;">${notification}</p>`).join("")}
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
      <div style="text-align: left;">
      <a href="https://planer.solvro.pl" style=color: #0056b3; font-weight: bold;">
        Dokonaj zmian w swoim kreatorze!
      </a>
      <br>
      <img src="https://planer.solvro.pl/og_image.png"
           alt="Logo Planer" style="margin-top: 10px; width: 350px; height: auto;">
      <br>
      <p style="color: #333; font-weight: bold;">Zespół Planera</p>
      </div>
    </div>
    `;
      await mail.send((message) => {
        message
          .from("Planer Solvro <planer@solvro.pl>")
          .to(`${studentNumber}@student.pwr.edu.pl`)
          .subject("Nastąpiły zmiany w twoich planach")
          .text("Nastąpiły zmiany w twoich planach")
          .html(htmlContent);
      });
    }
  }
}

function renderMeeting(meeting: GroupMeeting): string {
  switch (meeting.week) {
    case "-":
      return `w każdy ${meeting.day} od ${meeting.startTime} do ${meeting.endTime}`;
    case "TP":
      return `w parzysty ${meeting.day} od ${meeting.startTime} do ${meeting.endTime}`;
    case "TN":
      return `w nieparzysty ${meeting.day} od ${meeting.startTime} do ${meeting.endTime}`;
    case "!":
      return `jednorazowo w ${meeting.day} od ${meeting.startTime} do ${meeting.endTime}`;
  }
}

export default class Notifications extends BaseCommand {
  static commandName = "notifications";
  static description = "";

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
    staysAlive: false,
  };

  async run() {
    const schedules = await Schedule.query().preload("user");

    const currentGroups = await Group.query()
      .preload("lecturers")
      .preload("meetings");
    const archivedGroups = await GroupArchive.query()
      .preload("lecturers")
      .preload("meetings");

    const currentGroupsMap = new Map(
      currentGroups.map((group) => [group.id, group]),
    );
    const archivedGroupsMap = new Map(
      archivedGroups.map((group) => [group.id, group]),
    );

    const userNotifications = new Map<string, string[]>();

    for (const schedule of schedules) {
      const user = schedule.user;
      if (!user.allowNotifications) {
        continue;
      }

      for (const group of schedule.groups) {
        const currentGroup = currentGroupsMap.get(group.id);
        const archivedGroup = archivedGroupsMap.get(group.id);

        if (currentGroup === undefined || archivedGroup === undefined) {
          continue;
        }

        const notifications = userNotifications.get(user.studentNumber) ?? [];

        // scraper implementation detail: the scraper will never update a meetings row, and will create a new entry instead
        // therefore if ids match, nothing has changed
        const currentIds = currentGroup.meetings.map((m) => m.id);
        const archivedIds = archivedGroup.meetings.map((m) => m.id);
        if (
          currentIds.length !== archivedIds.length ||
          !currentIds.every((i) => archivedIds.includes(i))
        ) {
          const before = archivedGroup.meetings.map(renderMeeting).join(", ");
          const after = currentGroup.meetings.map(renderMeeting).join(", ");
          notifications.push(
            `Plan o nazwie ${schedule.name}: ${group.name}: Nastąpiła zmiana terminów zajęć z ${before} na ${after}`,
          );
        }

        const currentLecturers = currentGroup.lecturers
          .map((lecturer) => `${lecturer.name} ${lecturer.surname}`)
          .join(", ");

        const archivedLecturers = archivedGroup.lecturers
          .map((lecturer) => `${lecturer.name} ${lecturer.surname}`)
          .join(", ");

        if (currentLecturers !== archivedLecturers) {
          notifications.push(
            `Plan o nazwie ${schedule.name}: ${group.name}: Nastąpiła zmiana prowadzących z ${archivedLecturers} na ${currentLecturers}.`,
          );
        }

        if (notifications.length > 0) {
          userNotifications.set(user.studentNumber, notifications);
        }
      }
    }
    if (userNotifications.size > 0) {
      await sendEmail(userNotifications);
    }
  }
}
