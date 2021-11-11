import faker from 'faker'
import { EmailValidatorAdapter } from '@/infra/validators'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid(faker.internet.email())
    expect(isValid).toBe(false)
  })
})
