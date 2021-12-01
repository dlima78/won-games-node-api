import { makeAuthMiddleware } from '@/main/factories/middlewares'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'

export const auth = adaptMiddleware(makeAuthMiddleware())
