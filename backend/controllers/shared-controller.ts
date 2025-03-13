import { prisma } from '@/lib/db'
import { createSharedPlanType } from '@/validators'

export const SharedController = {
  getOne: async (sharedId: string) => {
    try {
      const plan = await prisma.shareds.findFirstOrThrow({
        where: {
          id: sharedId,
        },
      })

      return { success: true, data: plan }
    } catch (error) {
      console.log('🚀 ~ getOne: ~ error:', error)
      return {
        success: false,
        message: 'Failed to get plan',
      }
    }
  },
  create: async (data: createSharedPlanType) => {
    const shared = await prisma.shareds.create({
      data,
    })

    return { success: true, message: 'Plan created successfully', shared }
  },
}
