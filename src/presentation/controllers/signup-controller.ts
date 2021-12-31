import {
  HttpRequest,
  HttpResponse,
  Controller,
  Validation
} from '@/presentation/protocols'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import { AddAccount } from '@/domain/usecases/add-account'
import { Authentication } from '@/domain/usecases'
import { EmailInUseError } from '../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { password, email, name } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const authenticationModel = await this.authentication.auth({ email, password })
      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
