import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeLoginValidation } from '@/main/factories/controllers'
import { makeDbAuthentication } from '@/main/factories/usecases'
import { makeLogControllerDecorator } from '@/main/factories/decorator'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
