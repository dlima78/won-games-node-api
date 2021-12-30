import { EmailValidatorAdapter } from '@/infra/validators'
import { makeSignUpValidation } from '@/main/factories/controllers'
import { Validation } from '@/presentation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { CompareFieldsValidation } from '@/validation/validators/compare-fields-validation'

jest.mock('@/validation/validators/validation-composite')

describe('SigUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
