import { Authentication } from '@/domain/usecases'
import { LoginController } from '@/presentation/controllers'
import { InvalidParamError, MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { EmailValidator, HttpRequest } from '@/presentation/protocols'
import faker from 'faker'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationSpy implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new AuthenticationSpy()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorSpy implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorSpy()
}

type SutTypes = {
  sut: LoginController
  emailValidatorSpy: EmailValidator
  authenticationSpy: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationSpy = makeAuthentication()
  const emailValidatorSpy = makeEmailValidator()
  const sut = new LoginController(emailValidatorSpy, authenticationSpy)
  return {
    sut,
    emailValidatorSpy,
    authenticationSpy
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: faker.internet.password()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: faker.internet.email()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorSpy, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const isAuth = jest.spyOn(authenticationSpy, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isAuth).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })
})
