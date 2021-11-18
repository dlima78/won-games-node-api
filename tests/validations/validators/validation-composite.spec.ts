import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'
import { ValidationComposite } from '@/validation/validators'
import faker from 'faker'

const makeValidation = (): Validation => {
  class ValidationSpy implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationSpy()
}

type SutTypes = {
  sut: ValidationComposite
  validationsSpy: Validation[]
}

const makeSut = (): SutTypes => {
  const validationsSpy = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationsSpy)
  return {
    sut,
    validationsSpy
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationsSpy } = makeSut()
    jest.spyOn(validationsSpy[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: faker.name.firstName() })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationsSpy } = makeSut()
    jest.spyOn(validationsSpy[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationsSpy[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: faker.name.firstName() })
    expect(error).toEqual(new Error())
  })
})
