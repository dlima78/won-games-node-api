import { AccountModel } from '@/domain/models'
import { AddAccount, AddAccountParams, Authentication, AuthenticationParams, LoadAccountByToken } from '@/domain/usecases'
import { mockAccount } from '@/tests/domain/mocks'

export const mockAddAccount = (): AddAccount => {
  class AddAccountSpy implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new AddAccountSpy()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationSpy implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new AuthenticationSpy()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenSpy implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByTokenSpy()
}
