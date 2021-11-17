import { EmailValidator, HttpRequest, Validation } from '@/presentation/protocols'
import {
  MissingParamError,
  InvalidParamError,
  ServerError
} from '@/presentation/errors'
import { SignUpController } from '@/presentation/controllers'
import faker from 'faker'
import { AddAccount, AddAccountModel } from '@/domain/usecases/add-account'
import { AccountModel } from '@/domain/models/account'
import { ok, badRequest, serverError } from '@/presentation/helpers/http-helper'

const makeFakeRequest = (): HttpRequest => {
  const password = faker.internet.password()
  return {
    body: {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: password,
      passwordConfirmation: password
    }
  }
}

const makeValidation = (): Validation => {
  class ValidationSpy implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationSpy()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorSpy implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorSpy()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountSpy implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountSpy()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorSpy: EmailValidator
  addAccountSpy: AddAccount
  validationSpy: Validation
}

const makeSut = (): SutTypes => {
  const validationSpy = makeValidation()
  const addAccountSpy = makeAddAccount()
  const emailValidatorSpy = makeEmailValidator()
  const sut = new SignUpController(emailValidatorSpy, addAccountSpy, validationSpy)
  return {
    sut,
    emailValidatorSpy,
    addAccountSpy,
    validationSpy
  }
}

describe('SignUpController', () => {
  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        passwordConfirmation: faker.internet.password()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
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
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(email)
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const addSpy = jest.spyOn(addAccountSpy, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(Error())
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
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
