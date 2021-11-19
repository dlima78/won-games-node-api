import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adpter'
import { makeSignUpController } from '@/main/factories/controllers'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/signup', adaptRoute(makeSignUpController()))
}
