import { prisma } from '@/lib/db'
import { createScheduleType, updateScheduleType } from '@/validators'
import { format } from 'date-fns'

export const SchedulesController = {
  getAll: async (userId: number) => {
    const scheduleIds = await prisma.schedules
      .findMany({
        where: { userId },
        select: { id: true },
      })
      .then((res) => res.map((s) => s.id))

    const schedules = await prisma.schedules.findMany({
      where: { userId },
      include: {
        scheduleRegistrations: {
          include: {
            registrations: {
              where: { OR: [{ isActive: true }, { isActive: null }] },
            },
          },
        },
        scheduleCourses: {
          include: {
            courses: {
              where: { OR: [{ isActive: true }, { isActive: null }] },
              include: {
                groups: {
                  where: {
                    isActive: true,
                    scheduleGroups: {
                      some: { scheduleId: { in: scheduleIds } }, // Użycie wcześniej pobranych ID
                    },
                  },
                  include: {
                    groupLecturers: {
                      include: { lecturers: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    return schedules.map((schedule) => ({
      id: schedule.id,
      userId: schedule.userId,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
      name: schedule.name,
      sharedId: schedule.sharedId,
      registrations: schedule.scheduleRegistrations.map(
        ({ registrations }) => ({
          ...registrations,
        })
      ),
      courses: schedule.scheduleCourses.map((course) => ({
        id: course.courses?.id,
        name: course.courses?.name,
        groups: course.courses?.groups.map((group) => ({
          lecturer: group.groupLecturers.length
            ? group.groupLecturers
                .map((lecturer) =>
                  `${lecturer.lecturers?.name ?? ''} ${lecturer.lecturers?.surname ?? ''}`.trim()
                )
                .join(', ')
            : 'Brak prowadzącego',
          averageRating:
            group.groupLecturers.length > 0
              ? (
                  group.groupLecturers
                    .map((lecturer) =>
                      Number.parseFloat(
                        lecturer.lecturers?.averageRating ?? '0'
                      )
                    )
                    .filter((rating) => !Number.isNaN(rating))
                    .reduce((total, rating) => total + rating, 0) /
                  group.groupLecturers.length
                ).toFixed(2)
              : '0.00',
          opinionsCount:
            group.groupLecturers.length > 0
              ? group.groupLecturers
                  .map((lecturer) =>
                    Number.parseInt(
                      lecturer.lecturers?.opinionsCount ?? '0',
                      10
                    )
                  )
                  .filter((count) => !Number.isNaN(count))
                  .reduce((total, count) => total + count, 0)
              : 0,
          ...group,
          startTime: format(group.startTime!, 'HH:mm:ss'),
          endTime: format(group.endTime!, 'HH:mm:ss'),
        })),
      })),
    }))
  },
  getOne: async (userId: number, scheduleId: string) => {
    const schedule = await prisma.schedules.findFirst({
      where: {
        id: parseInt(scheduleId),
        userId,
      },
      include: {
        scheduleRegistrations: {
          include: {
            registrations: {
              where: {
                OR: [{ isActive: true }, { isActive: null }],
              },
            },
          },
        },
        scheduleCourses: {
          include: {
            courses: {
              include: {
                groups: {
                  where: {
                    isActive: true,
                    scheduleGroups: {
                      some: { scheduleId: parseInt(scheduleId) },
                    },
                  },
                  include: {
                    groupLecturers: {
                      include: { lecturers: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!schedule) return null

    return {
      id: schedule.id,
      userId: schedule.userId,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
      name: schedule.name,
      sharedId: schedule.sharedId,
      registrations: schedule.scheduleRegistrations.map(
        ({ registrations }) => ({
          ...registrations,
        })
      ),
      courses: schedule.scheduleCourses.map((course) => ({
        id: course.courses?.id,
        name: course.courses?.name,
        groups: course.courses?.groups.map((group) => ({
          lecturer: group.groupLecturers.length
            ? group.groupLecturers
                .map((lecturerData) =>
                  `${lecturerData.lecturers?.name ?? ''} ${lecturerData.lecturers?.surname ?? ''}`.trim()
                )
                .join(', ')
            : 'Brak prowadzącego',
          averageRating:
            group.groupLecturers.length > 0
              ? (
                  group.groupLecturers
                    .map((lecturerData) =>
                      Number.parseFloat(
                        lecturerData.lecturers?.averageRating ?? '0'
                      )
                    )
                    .filter((rating) => !Number.isNaN(rating))
                    .reduce((total, rating) => total + rating, 0) /
                  group.groupLecturers.length
                ).toFixed(2)
              : '0.00',
          opinionsCount:
            group.groupLecturers.length > 0
              ? group.groupLecturers
                  .map((lecturerData) =>
                    Number.parseInt(
                      lecturerData.lecturers?.opinionsCount ?? '0',
                      10
                    )
                  )
                  .filter((count) => !Number.isNaN(count))
                  .reduce((total, count) => total + count, 0)
              : 0,
          ...group,
          startTime: format(group.startTime!, 'HH:mm:ss'),
          endTime: format(group.endTime!, 'HH:mm:ss'),
        })),
      })),
    }
  },
  create: async (userId: number, body: createScheduleType) => {
    const { name, groups, registrations, courses } = body

    const newSchedule = await prisma.$transaction(async (prisma) => {
      const schedule = await prisma.schedules.create({
        data: { userId, name, updatedAt: new Date() },
      })

      if (groups?.length) {
        await prisma.scheduleGroups.createMany({
          data: groups.map((group) => ({
            scheduleId: schedule.id,
            groupId: group.id,
          })),
          skipDuplicates: true,
        })
      }

      if (registrations?.length) {
        await prisma.scheduleRegistrations.createMany({
          data: registrations.map((registration) => ({
            scheduleId: schedule.id,
            registrationId: registration.id.toString(),
          })),
          skipDuplicates: true,
        })
      }

      if (courses?.length) {
        await prisma.scheduleCourses.createMany({
          data: courses.map((course) => ({
            scheduleId: schedule.id,
            courseId: course.id.toString(),
          })),
          skipDuplicates: true,
        })
      }

      return schedule
    })

    return { message: 'Schedule created.', schedule: newSchedule }
  },
  updateOne: async (
    userId: number,
    scheduleId: string,
    body: updateScheduleType
  ) => {
    const { name, sharedId, updatedAt, groups, registrations, courses } = body
    const scheduleIdInt = parseInt(scheduleId)

    const updatedSchedule = await prisma.$transaction(async (prisma) => {
      const schedule = await prisma.schedules.update({
        where: { id: scheduleIdInt, userId },
        data: { name, sharedId, updatedAt },
      })

      if (groups) {
        await prisma.scheduleGroups.deleteMany({
          where: { scheduleId: schedule.id },
        })
        await prisma.scheduleGroups.createMany({
          data: groups.map((group) => ({
            scheduleId: schedule.id,
            groupId: group.id,
          })),
          skipDuplicates: true,
        })
      }

      if (registrations) {
        await prisma.scheduleRegistrations.deleteMany({
          where: { scheduleId: schedule.id },
        })
        await prisma.scheduleRegistrations.createMany({
          data: registrations.map((registration) => ({
            scheduleId: schedule.id,
            registrationId: registration.id.toString(),
          })),
          skipDuplicates: true,
        })
      }

      if (courses) {
        await prisma.scheduleCourses.deleteMany({
          where: { scheduleId: schedule.id },
        })
        await prisma.scheduleCourses.createMany({
          data: courses.map((course) => ({
            scheduleId: schedule.id,
            courseId: course.id.toString(),
          })),
          skipDuplicates: true,
        })
      }

      return { success: true, schedule }
    })

    return updatedSchedule
  },
  deleteOne: async (userId: number, scheduleId: string) => {
    await prisma.schedules.delete({
      where: {
        id: parseInt(scheduleId),
        userId,
      },
    })

    return { success: true, message: 'Schedule successfully deleted.' }
  },
}
