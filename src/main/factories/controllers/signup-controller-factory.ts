import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from '@/main/factories/controllers'
import { makeDbAddAccount, makeDbAuthentication } from '@/main/factories/usecases'
import { makeLogControllerDecorator } from '../decorator'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
