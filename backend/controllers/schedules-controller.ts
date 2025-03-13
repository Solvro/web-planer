import { prisma } from '@/lib/db'
import { createScheduleType, updateScheduleType } from '@/validators'

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
      registrations: schedule.scheduleRegistrations,
      courses: schedule.scheduleCourses.map((course) => ({
        id: course.courses?.id,
        name: course.courses?.name,
        groups: course.courses?.groups.map((group) => ({
          id: group.id,
          name: group.name,
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
      registrations: schedule.scheduleRegistrations.map((reg) => ({
        ...reg,
      })),
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
        })),
      })),
    }
  },
  create: async (userId: number, body: createScheduleType) => {
    const schedule = await prisma.schedules.create({
      data: {
        userId,
        ...body,
      },
    })

    if (body.groups) {
      await prisma.scheduleGroups.createMany({
        data: body.groups.map((group) => ({
          scheduleId: schedule.id,
          groupId: group.id,
        })),
        skipDuplicates: true,
      })
    }

    if (body.registrations) {
      await prisma.scheduleRegistrations.createMany({
        data: body.registrations.map((registration) => ({
          scheduleId: schedule.id,
          registrationId: registration.id.toString(),
        })),
        skipDuplicates: true,
      })
    }

    if (body.courses) {
      await prisma.scheduleCourses.createMany({
        data: body.courses.map((course) => ({
          scheduleId: schedule.id,
          courseId: course.id.toString(),
        })),
        skipDuplicates: true,
      })
    }

    return schedule
  },
  updateOne: async (
    userId: number,
    scheduleId: string,
    body: updateScheduleType
  ) => {
    const { name, sharedId, updatedAt } = body
    const toUpdate = { name, sharedId, updatedAt }
    const schedule = await prisma.schedules.update({
      where: {
        id: parseInt(scheduleId),
        userId,
      },
      data: {
        ...toUpdate,
      },
    })

    if (body.groups) {
      await prisma.scheduleGroups.deleteMany({
        where: { scheduleId: schedule.id },
      })

      await prisma.scheduleGroups.createMany({
        data: body.groups.map((group) => ({
          scheduleId: schedule.id,
          groupId: group.id,
        })),
        skipDuplicates: true,
      })
    }

    if (body.registrations) {
      await prisma.scheduleRegistrations.deleteMany({
        where: { scheduleId: schedule.id },
      })

      await prisma.scheduleRegistrations.createMany({
        data: body.registrations.map((registration) => ({
          scheduleId: schedule.id,
          registrationId: registration.id.toString(),
        })),
        skipDuplicates: true,
      })
    }

    if (body.courses) {
      await prisma.scheduleCourses.deleteMany({
        where: { scheduleId: schedule.id },
      })

      await prisma.scheduleCourses.createMany({
        data: body.courses.map((course) => ({
          scheduleId: schedule.id,
          courseId: course.id.toString(),
        })),
        skipDuplicates: true,
      })
    }

    return schedule
  },
  deleteOne: async (userId: number, scheduleId: string) => {
    await prisma.schedules.delete({
      where: {
        id: parseInt(scheduleId),
        userId,
      },
    })
  },
}
