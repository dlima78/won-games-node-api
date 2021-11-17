import { Controller, EmailValidator, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { InvalidParamError, MissingParamError, ServerError } from '@/presentation/errors'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requireFields = ['email', 'password']
      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return await Promise.resolve(badRequest(new MissingParamError(field)))
        }
      }
      const { email } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return await Promise.resolve(badRequest(new InvalidParamError('email')))
      }
    } catch (error) {
      return serverError(new ServerError(error))
    }
  }
}
