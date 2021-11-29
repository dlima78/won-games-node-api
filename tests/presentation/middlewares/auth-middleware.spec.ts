import { AccountModel } from '@/domain/models/account'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccessDeniedError } from '@/presentation/errors'
import { forbiden } from '@/presentation/helpers/http-helper'
import { AuthMiddleware } from '@/presentation/middlewares'
import { HttpRequest } from '@/presentation/protocols'

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any-token'
  }
})

const mockAccount = (): AccountModel => ({
  id: 'any-id',
  name: 'any-name',
  email: 'email@mail.com',
  password: 'any-password'
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenSpy implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByTokenSpy()
}

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenSpy = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenSpy)
  return {
    sut,
    loadAccountByTokenSpy
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbiden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenSpy, 'load')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any-token')
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    jest.spyOn(loadAccountByTokenSpy, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbiden(new AccessDeniedError()))
  })
})
