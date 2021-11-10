import { HttpRequest } from '@/presentation/protocols/http'
import { MissingParamError } from '@/presentation/errors/missing-param-error'
import { badRequest } from '@/presentation/helpers/http-helper'

export class SignupController {
  handle (httpRequest: HttpRequest): any {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
