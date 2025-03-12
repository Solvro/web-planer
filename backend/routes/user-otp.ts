import { AuthController } from '@/controllers/auth-controller'
import Elysia from 'elysia'
import { rateLimit } from 'elysia-rate-limit'
import { Server } from 'elysia-rate-limit/dist/@types/Server'

const getRealIp = (req: Request, server: Server | null): string => {
  const xForwardedFor = req.headers.get('X-Forwarded-For')
  if (xForwardedFor) {
    console.log('xForwardedFor', xForwardedFor)
    return xForwardedFor.split(',')[0].trim()
  }
  console.log('requestIP', server?.requestIP(req))
  console.log("req.headers.get('x-real-ip')", req.headers.get('x-real-ip'))
  return server?.requestIP(req)?.address ?? req.headers.get('x-real-ip') ?? ''
}

export const usersOtp = new Elysia({ prefix: '/user/otp' })
  .use(
    rateLimit({
      max: 6,
      duration: 60000,
      generator: (req, server) => getRealIp(req, server),
      errorResponse: new Response('Too many requests', { status: 429 }),
    })
  )
  .post('/verify', AuthController.otpVerify)
  .post('/get', AuthController.otpGet)
