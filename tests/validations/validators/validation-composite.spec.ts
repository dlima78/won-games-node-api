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
  validationSpy: Validation
}

const makeSut = (): SutTypes => {
  const validationSpy = makeValidation()
  const sut = new ValidationComposite([validationSpy])
  return {
    sut,
    validationSpy
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: faker.name.firstName() })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
