import assert from 'node:assert'

import { prisma } from '../lib/db'
import { strings } from '../utils/strings'

const coursesTransformer = (courses: any[]) => {
  return courses.map((course: any) => ({
    id: course.id,
    name: course.name,
    registrationId: course.registration_id,
    createdAt: course.created_at,
    updatedAt: course.updated_at,
    groups: course.groups.map((group: any) => ({
      lecturer: Array.isArray(group.groupLecturers)
        ? group.groupLecturers
            .map(
              (lecturer: any) =>
                `${lecturer.lecturers?.name} ${lecturer.lecturers?.surname}`
            )
            .join(', ')
        : 'Brak prowadzącego',
      averageRating:
        Array.isArray(group.groupLecturers) && group.groupLecturers.length > 0
          ? (
              group.groupLecturers
                .map((lecturer: any) =>
                  Number.parseFloat(lecturer.lecturers?.average_rating || '0')
                )
                .filter((rating: any) => !Number.isNaN(rating))
                .reduce((total: any, rating: any) => total + rating, 0) /
              group.groupLecturers.length
            ).toFixed(2)
          : '0.00',
      opinionsCount:
        Array.isArray(group.groupLecturers) && group.groupLecturers.length > 0
          ? group.groupLecturers
              .map((lecturer: any) =>
                Number.parseInt(lecturer.lecturers?.opinions_count || '0', 10)
              )
              .filter((count: any) => !Number.isNaN(count))
              .reduce((total: any, count: any) => total + count, 0)
          : 0,
      ...group,
    })),
  }))
}

export const CoursesController = {
  getCourses: async (registration_id: string) => {
    try {
      assert(typeof registration_id === 'string')
      const registrationId = decodeURIComponent(registration_id)
      const courses = await prisma.courses.findMany({
        where: {
          registrationId,
          OR: [{ isActive: true }, { isActive: null }],
        },
        include: {
          groups: {
            where: {
              OR: [{ isActive: true }, { isActive: null }],
            },
            include: {
              groupLecturers: {
                include: {
                  lecturers: true,
                },
              },
            },
          },
        },
      })

      const transformedCourses = coursesTransformer(courses)

      return transformedCourses
    } catch (error) {
      console.log('🚀 ~ getDepartments: ~ error:', error)
      return {
        data: [],
        message: strings.response.failed,
      }
    }
  },
  getCourseById: async (registration_id: string, course_id: string) => {
    try {
      assert(typeof registration_id === 'string')
      const registrationId = decodeURIComponent(registration_id)
      const courseId = decodeURIComponent(course_id)
      const courses = await prisma.courses.findMany({
        where: {
          id: courseId,
          registrationId,
          OR: [{ isActive: true }, { isActive: null }],
        },
        include: {
          groups: {
            where: {
              OR: [{ isActive: true }, { isActive: null }],
            },
            include: {
              groupLecturers: {
                include: {
                  lecturers: true,
                },
              },
            },
          },
        },
      })

      const transformedCourses = coursesTransformer(courses)

      return transformedCourses[0]
    } catch (error) {
      console.log('🚀 ~ getDepartments: ~ error:', error)
      return {
        data: [],
        message: strings.response.failed,
      }
    }
  },
}
