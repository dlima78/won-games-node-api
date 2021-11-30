/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adpter'
import { makeAddSurveyController } from '@/main/factories/controllers'
import { makeAuthMiddleware } from '@/main/factories/middlewares'
import { adaptMiddleware } from '../adapters/express-middleware-adpter'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}
