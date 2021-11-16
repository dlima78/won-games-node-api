import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { EmailValidatorAdapter } from '@/infra/validators'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRespository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRespository)
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount)
  return new LogControllerDecorator(signupController)
}
