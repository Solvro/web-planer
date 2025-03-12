import { AuthController } from '@/controllers/auth-controller'
import Elysia from 'elysia'

export const usersOtp = new Elysia({ prefix: '/user/otp' })
  .post('/verify', AuthController.otpVerify)
  .post('/get', AuthController.otpGet)
