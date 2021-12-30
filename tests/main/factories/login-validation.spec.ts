import { EmailValidatorAdapter } from '@/infra/validators'
import { makeLoginValidation } from '@/main/factories/controllers'
import { Validation } from '@/presentation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

jest.mock('@/validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
