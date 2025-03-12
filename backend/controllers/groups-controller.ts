import { prisma } from '@/lib/db'
import { strings } from '@/utils/strings'

export const GroupsController = {
  getGroups: async (courseId: string) => {
    try {
      const groups = await prisma.groups.findMany({
        where: {
          course_id: courseId,
          OR: [{ is_active: true }, { is_active: null }],
        },
        include: {
          group_lecturers: {
            include: {
              lecturers: true,
            },
          },
        },
      })

      const transformedGroups = groups.map((group) => ({
        lecturer: group.group_lecturers.length
          ? group.group_lecturers
              .map(
                (lecturer) =>
                  `${lecturer.lecturers?.name} ${lecturer.lecturers?.surname}`
              )
              .join(', ')
          : 'Brak prowadzącego',
        averageRating:
          group.group_lecturers.length > 0
            ? (
                group.group_lecturers.reduce(
                  (total, lecturer) =>
                    total +
                    (Number.parseFloat(
                      lecturer.lecturers?.average_rating || '0'
                    ) || 0),
                  0
                ) / group.group_lecturers.length
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
          course_id: courseId,
          id: parseInt(groupId || '0'),
          OR: [{ is_active: true }, { is_active: null }],
        },
        include: {
          group_lecturers: {
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
        lecturer: Array.isArray(group.group_lecturers)
          ? group.group_lecturers
              .map(
                (lecturer) =>
                  `${lecturer.lecturers?.name} ${lecturer.lecturers?.surname}`
              )
              .join(', ')
          : 'Brak prowadzącego',
        averageRating:
          Array.isArray(group.group_lecturers) &&
          group.group_lecturers.length > 0
            ? (
                group.group_lecturers
                  .map((lecturer) =>
                    Number.parseFloat(lecturer.lecturers?.average_rating || '0')
                  )
                  .filter((rating) => !Number.isNaN(rating))
                  .reduce((total, rating) => total + rating, 0) /
                group.group_lecturers.length
              ).toFixed(2)
            : '0.00',
        opinionsCount:
          Array.isArray(group.group_lecturers) &&
          group.group_lecturers.length > 0
            ? group.group_lecturers
                .map((lecturer) =>
                  Number.parseInt(lecturer.lecturers?.opinions_count || '0', 10)
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
