import { Authentication, AuthenticationModel } from '@/domain/usecases'
import { LoginController } from '@/presentation/controllers'
import { HttpRequest, Validation } from '@/presentation/protocols'
import faker from 'faker'
import { MissingParamError, ServerError } from '@/presentation/errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@/presentation/helpers/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
})

const makeValidation = (): Validation => {
  class ValidationSpy implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationSpy()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationSpy implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new AuthenticationSpy()
}

type SutTypes = {
  sut: LoginController
  authenticationSpy: Authentication
  validationSpy: Validation
}

const makeSut = (): SutTypes => {
  const validationSpy = makeValidation()
  const authenticationSpy = makeAuthentication()
  const sut = new LoginController(authenticationSpy, validationSpy)
  return {
    sut,
    authenticationSpy,
    validationSpy
  }
}

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const isAuth = jest.spyOn(authenticationSpy, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isAuth).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(await Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if Authentication success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
