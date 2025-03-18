import { prisma } from '@/lib/db'

import { strings } from '../utils/strings'

export const RegistrationsController = {
  getRegistrations: async (department_id: unknown) => {
    try {
      if (typeof department_id === 'string') {
        const departmentId = decodeURIComponent(department_id)
        const departments = await prisma.registrations.findMany({
          where: {
            departmentId,
            OR: [{ isActive: true }, { isActive: null }],
          },
        })
        return departments
      }
      return {
        data: [],
        message: strings.response.failed,
      }
    } catch (error) {
      console.log('🚀 ~ getDepartments: ~ error:', error)
      return {
        data: [],
        message: strings.response.failed,
      }
    }
  },
  getRegistrationById: async (
    department_id: unknown,
    registration_id: unknown
  ) => {
    try {
      if (
        typeof department_id === 'string' &&
        typeof registration_id === 'string'
      ) {
        const departmentId = decodeURIComponent(department_id)
        const registrationId = decodeURIComponent(registration_id)
        const department = await prisma.registrations.findFirst({
          where: {
            departmentId,
            id: registrationId,
            OR: [{ isActive: true }, { isActive: null }],
          },
        })
        return department
      }
      return {
        data: [],
        message: strings.response.failed,
      }
    } catch (error) {
      console.log('🚀 ~ getDepartments: ~ error:', error)
      return {
        data: [],
        message: strings.response.failed,
      }
    }
  },
}
