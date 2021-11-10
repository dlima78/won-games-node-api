import { SignupController } from '@/presentation/controllers/signup'
import { MissingParamError } from '@/presentation/errors/missing-param-error'
import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { EmailValidator } from '@/presentation/protocols/email-validator'
import faker from 'faker'

interface SutTypes {
  sut: SignupController
  emailValidatorSpy: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorSpy implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new SignupController(emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
  }
}

describe('SignupController', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const password = faker.internet.password()
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: password,
        passwordConfirmation: password
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const password = faker.internet.password()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        password: password,
        passwordConfirmation: password
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        passwordConfirmation: faker.internet.password()
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid emai is provided', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const password = faker.internet.password()

    jest.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: password,
        passwordConfirmation: password
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorSpy, 'isValid')
    const password = faker.internet.password()
    const email = faker.internet.email()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: email,
        password: password,
        passwordConfirmation: password
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(email)
  })
})
