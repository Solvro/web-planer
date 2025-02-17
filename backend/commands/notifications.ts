import { BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import mail from "@adonisjs/mail/services/main";

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

export default class Notifications extends BaseCommand {
  static commandName = "notifications";
  static description = "";

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
    staysAlive: false,
  };

  async run() {
    const GroupArchiveModule = await import("#models/group_archive");
    const GroupArchive = GroupArchiveModule.default;
    const GroupModule = await import("#models/group");
    const Group = GroupModule.default;
    const ScheduleModule = await import("#models/schedule");
    const Schedule = ScheduleModule.default;
    const UserModule = await import("#models/user");
    const User = UserModule.default;

    const schedules = await Schedule.query().preload("groups");

    const currentGroups = await Group.query().preload("lecturers");
    const archivedGroups = await GroupArchive.query().preload("lecturers");

    const currentGroupsMap = new Map(
      currentGroups.map((group) => [group.id, group]),
    );
    const archivedGroupsMap = new Map(
      archivedGroups.map((group) => [group.id, group]),
    );

    const userNotifications = new Map<string, string[]>();

    for (const schedule of schedules) {
      for (const group of schedule.groups) {
        const currentGroup = currentGroupsMap.get(group.id);
        const archivedGroup = archivedGroupsMap.get(group.id);

        try {
          const user = await User.findOrFail(schedule.userId);
          if (!user.allowNotifications) {
            break;
          }

          if (archivedGroup !== undefined) {
            const notifications =
              userNotifications.get(user.studentNumber) ?? [];

            if (currentGroup?.startTime !== archivedGroup.startTime) {
              notifications.push(
                `Plan o nazwie ${schedule.name}: ${group.name}: Nastąpiła zmiana godzin zajęć z ${archivedGroup.startTime.slice(0, -3)}-${archivedGroup.endTime.slice(0, -3)} na ${currentGroup?.startTime.slice(0, -3)}-${currentGroup?.endTime.slice(0, -3)}.`,
              );
            }
            const currentLecturers = currentGroup?.lecturers
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
        } catch (error) {
          this.logger.error(
            `Error while searching for a user ${schedule.userId}: ${error}`,
          );
        }
      }
    }
    if (userNotifications.size > 0) {
      await sendEmail(userNotifications);
    }
  }
}
