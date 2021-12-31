import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { HashComparer, LoadAccountByEmailRepository, Encrypter, UpdateAccessTokenRepository } from '@/data/protocols'
import { AuthenticationModel } from '@/domain/models'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authenticationParams: AuthenticationParams): Promise<AuthenticationModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationParams.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authenticationParams.password, account.password)
      if (isValid) {
        const token = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, token)
        return {
          accessToken: token,
          name: account.name
        }
      }
    }
    return null
  }
}
