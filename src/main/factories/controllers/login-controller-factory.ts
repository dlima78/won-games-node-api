import { DbAuthentication } from '@/data/usecases'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { AccountMongoRepository, LogMongoRepository } from '@/infra/db/mongodb'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeLoginValidation } from '@/main/factories/controllers'
import env from '@/main/config/env'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
