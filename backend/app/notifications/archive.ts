import GroupArchive from '#models/group_archive'
import Schedule from '#models/schedule'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'

export async function checkDifferencesInUserSchedules() {
  const schedules = await Schedule.query()
    .preload('groups')
    .select('id', 'userId', 'name', 'createdAt', 'updatedAt')

  const userGroupsMap: Record<number, any[]> = {}

  for (const schedule of schedules) {
    if (!userGroupsMap[schedule.userId]) {
      userGroupsMap[schedule.userId] = []
    }
    userGroupsMap[schedule.userId].push({
      id: schedule.id,
      name: schedule.name,
      groups: schedule.groups.map((group) => ({
        id: group.id,
        name: group.name,
        startTime: group.startTime,
        lecturer: group.lecturer,
      })),
    })
  }

  // Pobranie użytkowników z grupami
  const users = await User.query().whereIn('id', Object.keys(userGroupsMap).map(Number))

  for (const user of users) {
    const userSchedules = userGroupsMap[user.id]
    console.log(`Sprawdzanie użytkownika: ${user.studentNumber}`)

    // Pobranie archiwalnych grup użytkownika z grup archiwalnych
    const archivedGroups = await GroupArchive.query()
      .whereIn(
        'id',
        userSchedules.flatMap((schedule) => schedule.groups.map((g: any) => g.id))
      )
      .select('id', 'startTime', 'lecturer', 'name')

    const changesDetected = checkChanges(userSchedules, archivedGroups)

    if (changesDetected) {
      sendEmail(`${user.studentNumber}@student.pwr.edu.pl`)
    }
  }
}

/**
 * Funkcja sprawdzająca zmiany między grupami
 */
function checkChanges(userSchedules: any[], archivedGroups: any[]) {
  for (const schedule of userSchedules) {
    for (const group of schedule.groups) {
      const archivedGroup = archivedGroups.find((ag) => ag.id === group.id)

      if (!archivedGroup) {
        console.log('Grupa została dodana:', group)
        return true
      }

      if (
        archivedGroup.startTime !== group.startTime ||
        archivedGroup.lecturer !== group.lecturer
      ) {
        console.log('Zmiana w grupie:', group)
        return true
      }
    }
  }

  console.log('Brak zmian')
  return false
}
async function sendEmail(email: string) {
  mail.send((message) => {
    message
      .to(email)
      .subject('Zmiana w Twoim planie')
      .text('Nastąpiły zmiany w jednym z Twoich planów')
  })
}
