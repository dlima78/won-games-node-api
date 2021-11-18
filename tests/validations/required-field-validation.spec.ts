import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from '@/validation/validators'
import faker from 'faker'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails ', () => {
    const sut = makeSut()
    const error = sut.validate({ email: faker.internet.email() })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
