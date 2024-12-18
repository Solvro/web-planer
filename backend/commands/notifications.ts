import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import mail from '@adonisjs/mail/services/main'

interface ChangedGroup {
  groupId: number
  reason: string
}
async function sendEmail(email: string) {
  mail.send((message) => {
    message
      .to(email)
      .subject('Zmiana w Twoim planie')
      .text('Nastąpiły zmiany w jednym z Twoich planów')
  })
}

export default class Notifications extends BaseCommand {
  static commandName = 'notifications'
  static description = ''

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
    staysAlive: false,
  }

  async run() {
    const GroupArchiveModule = await import('#models/group_archive')
    const GroupArchive = GroupArchiveModule.default
    const GroupModule = await import('#models/group')
    const Group = GroupModule.default
    const ScheduleModule = await import('#models/schedule')
    const Schedule = ScheduleModule.default
    const UserModule = await import('#models/user')
    const User = UserModule.default

    const schedules = await Schedule.query().preload('groups')

    const currentGroups = await Group.all()
    const archivedGroups = await GroupArchive.all()

    const currentGroupsMap = new Map(currentGroups.map((group) => [group.id, group]))
    const archivedGroupsMap = new Map(archivedGroups.map((group) => [group.id, group]))

    const changes: ChangedGroup[] = []

    for (const schedule of schedules) {
      for (const group of schedule.groups) {
        const currentGroup = currentGroupsMap.get(group.id)
        const archivedGroup = archivedGroupsMap.get(group.id)

        try {
          const user = await User.findOrFail(schedule.userId)

          if (archivedGroup) {
            if (
              currentGroup?.startTime !== archivedGroup.startTime ||
              currentGroup?.lecturer !== archivedGroup.lecturer
            ) {
              await sendEmail(`${user.studentNumber}@student.pwr.edu.pl`)
            }
          }
        } catch (error) {
          this.logger.error(
            `Błąd podczas wyszukiwania użytkownika ${schedule.userId}: ${error.message}`
          )
        }
      }
    }

    this.logger.log('Detected changes:')
    this.logger.log(JSON.stringify(changes))
  }
}
