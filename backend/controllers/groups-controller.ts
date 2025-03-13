import { prisma } from '@/lib/db'
import { strings } from '@/utils/strings'

export const GroupsController = {
  getGroups: async (courseId: string) => {
    try {
      const groups = await prisma.groups.findMany({
        where: {
          courseId,
          OR: [{ isActive: true }, { isActive: null }],
        },
        include: {
          groupLecturers: {
            include: {
              lecturers: true,
            },
          },
        },
      })

      const transformedGroups = groups.map((group) => ({
        lecturer: group.groupLecturers.length
          ? group.groupLecturers
              .map(
                (lecturer) =>
                  `${lecturer.lecturers?.name} ${lecturer.lecturers?.surname}`
              )
              .join(', ')
          : 'Brak prowadzącego',
        averageRating:
          group.groupLecturers.length > 0
            ? (
                group.groupLecturers.reduce(
                  (total, lecturer) =>
                    total +
                    (Number.parseFloat(
                      lecturer.lecturers?.averageRating || '0'
                    ) || 0),
                  0
                ) / group.groupLecturers.length
              ).toFixed(2)
            : '0.00',
        ...group,
      }))

      return transformedGroups
    } catch (error) {
      console.log('🚀 ~ getDepartments: ~ error:', error)
      return {
        data: [],
        message: strings.response.failed,
      }
    }
  },
  getGroupsById: async (courseId: string, groupId: string) => {
    try {
      const group = await prisma.groups.findFirst({
        where: {
          courseId,
          id: parseInt(groupId || '0'),
          OR: [{ isActive: true }, { isActive: null }],
        },
        include: {
          groupLecturers: {
            include: {
              lecturers: true,
            },
          },
        },
      })

      if (!group) {
        return {
          data: [],
          message: strings.response.failed,
        }
      }

      const transformedGroup = {
        lecturer: Array.isArray(group.groupLecturers)
          ? group.groupLecturers
              .map(
                (lecturer) =>
                  `${lecturer.lecturers?.name} ${lecturer.lecturers?.surname}`
              )
              .join(', ')
          : 'Brak prowadzącego',
        averageRating:
          Array.isArray(group.groupLecturers) && group.groupLecturers.length > 0
            ? (
                group.groupLecturers
                  .map((lecturer) =>
                    Number.parseFloat(lecturer.lecturers?.averageRating || '0')
                  )
                  .filter((rating) => !Number.isNaN(rating))
                  .reduce((total, rating) => total + rating, 0) /
                group.groupLecturers.length
              ).toFixed(2)
            : '0.00',
        opinionsCount:
          Array.isArray(group.groupLecturers) && group.groupLecturers.length > 0
            ? group.groupLecturers
                .map((lecturer) =>
                  Number.parseInt(lecturer.lecturers?.opinionsCount || '0', 10)
                )
                .filter((count) => !Number.isNaN(count))
                .reduce((total, count) => total + count, 0)
            : 0,
        ...group,
      }

      return transformedGroup
    } catch (error) {
      console.log('🚀 ~ getDepartments: ~ error:', error)
      return {
        data: [],
        message: strings.response.failed,
      }
    }
  },
}
