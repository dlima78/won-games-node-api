import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/cryptography'
import { AccountMongoRepository, LogMongoRepository } from '@/infra/db/mongodb'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from '.'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRespository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRespository)
  const signupController = new SignUpController(dbAddAccount, makeSignUpValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}
