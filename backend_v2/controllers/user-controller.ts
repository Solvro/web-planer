export const UserController = {
  getUser: async () => {
    try {
      return {
        data: [],
        message: 'User data',
      }
    } catch (error) {
      console.log('🚀 ~ getUser: ~ error:', error)
      return {
        data: [],
        message: 'Failed to get user data',
      }
    }
  },
}
