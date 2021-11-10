import { HttpRequest } from '@/presentation/protocols/http'
import { MissingParamError } from '@/presentation/errors/missing-param-error'

export class SignupController {
  handle (httpRequest: HttpRequest): any {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
  }
}
