/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adpter'
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories/controllers'
import { makeAuthMiddleware } from '@/main/factories/middlewares'
import { adaptMiddleware } from '../adapters/express-middleware-adpter'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
