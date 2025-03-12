import { prisma } from '@/lib/db'

import { strings } from '../utils/strings'

export const RegistrationsController = {
  getRegistrations: async (department_id: unknown) => {
    try {
      if (typeof department_id === 'string') {
        const departmentId = decodeURIComponent(department_id)
        const departments = await prisma.registrations.findMany({
          where: {
            department_id: departmentId,
            OR: [{ is_active: true }, { is_active: null }],
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
            department_id: departmentId,
            id: registrationId,
            OR: [{ is_active: true }, { is_active: null }],
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
