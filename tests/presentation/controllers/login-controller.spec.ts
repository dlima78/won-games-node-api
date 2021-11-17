import { LoginController } from '@/presentation/controllers'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http-helper'
import { EmailValidator } from '@/presentation/protocols'
import faker from 'faker'

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
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = makeEmailValidator()
  const sut = new LoginController(emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
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
    const httpRequest = {
      body: {
        email: faker.name.firstName(),
        password: faker.internet.password()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorSpy, 'isValid')
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })
})
