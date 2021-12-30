import { EmailValidator } from '@/presentation/protocols'

export class EmailValidatorSpy implements EmailValidator {
  isValidEmail = true
  email: string
  isValid (email: string): boolean {
    this.email = email
    return this.isValidEmail
  }
}
