import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from '@/validation/validators'
import faker from 'faker'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFields Validation', () => {
  test('Should return a InvalidParamError if validation fails ', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: faker.name.firstName(),
      fieldToCompare: faker.name.middleName()
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return validation succeeds ', () => {
    const sut = makeSut()
    const password = faker.internet.password()
    const error = sut.validate({
      field: password,
      fieldToCompare: password
    })
    expect(error).toBeFalsy()
  })
})
