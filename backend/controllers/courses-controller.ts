import assert from 'node:assert'

import { prisma } from '../lib/db'
import { strings } from '../utils/strings'
import { format } from 'date-fns'

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
            where: { OR: [{ isActive: true }, { isActive: null }] },
            include: {
              groupLecturers: {
                include: { lecturers: true },
              },
            },
          },
        },
      })

      const transformedCourses = courses.map(
        ({ id, name, registrationId, createdAt, updatedAt, groups }) => ({
          id,
          name,
          registrationId,
          createdAt,
          updatedAt,
          groups: groups.map(
            ({ id, name, groupLecturers, startTime, endTime, ...rest }) => ({
              id,
              name,
              lecturer: groupLecturers.length
                ? groupLecturers
                    .map(({ lecturers }) =>
                      `${lecturers?.name ?? ''} ${lecturers?.surname ?? ''}`.trim()
                    )
                    .join(', ')
                : 'Brak prowadzącego',
              averageRating: groupLecturers.length
                ? (
                    groupLecturers.reduce(
                      (total, { lecturers }) =>
                        total +
                        (Number.parseFloat(lecturers?.averageRating ?? '0') ||
                          0),
                      0
                    ) / groupLecturers.length
                  ).toFixed(2)
                : '0.00',
              opinionsCount: groupLecturers.reduce(
                (total, { lecturers }) =>
                  total +
                  (Number.parseInt(lecturers?.opinionsCount ?? '0', 10) || 0),
                0
              ),
              startTime: format(startTime!, 'HH:mm:ss'),
              endTime: format(endTime!, 'HH:mm:ss'),
              ...rest,
            })
          ),
        })
      )

      console.log(transformedCourses)
      return transformedCourses
    } catch (error) {
      console.log('🚀 ~ getCourses ~ error:', error)
      return {
        data: [],
        message: strings.response.failed,
      }
    }
  },
  getCourseById: async (course_id: string) => {
    try {
      assert(typeof course_id === 'string')
      const courseId = decodeURIComponent(course_id)

      const course = await prisma.courses.findFirst({
        where: { id: courseId },
        include: {
          groups: {
            where: { OR: [{ isActive: true }, { isActive: null }] },
            include: {
              groupLecturers: {
                include: { lecturers: true },
              },
            },
          },
        },
      })

      const transformedCourse = {
        id: course?.id,
        name: course?.name,
        registrationId: course?.registrationId,
        createdAt: course?.createdAt,
        updatedAt: course?.updatedAt,
        groups: course?.groups.map(
          ({ id, name, groupLecturers, startTime, endTime, ...rest }) => ({
            id,
            name,
            lecturer: groupLecturers.length
              ? groupLecturers
                  .map(({ lecturers }) =>
                    `${lecturers?.name ?? ''} ${lecturers?.surname ?? ''}`.trim()
                  )
                  .join(', ')
              : 'Brak prowadzącego',
            averageRating: groupLecturers.length
              ? (
                  groupLecturers.reduce(
                    (total, { lecturers }) =>
                      total +
                      (Number.parseFloat(lecturers?.averageRating ?? '0') || 0),
                    0
                  ) / groupLecturers.length
                ).toFixed(2)
              : '0.00',
            opinionsCount: groupLecturers.reduce(
              (total, { lecturers }) =>
                total +
                (Number.parseInt(lecturers?.opinionsCount ?? '0', 10) || 0),
              0
            ),
            startTime: format(startTime!, 'HH:mm:ss'),
            endTime: format(endTime!, 'HH:mm:ss'),
            ...rest,
          })
        ),
      }

      console.log(transformedCourse)
      return transformedCourse
    } catch (error) {
      console.log('🚀 ~ getCourseById ~ error:', error)
      return {
        data: {},
        message: strings.response.failed,
      }
    }
  },
}
