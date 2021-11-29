import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { AccessDeniedError } from '@/presentation/errors'
import { forbiden, ok } from '@/presentation/helpers/http-helper'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'

export class AuthMiddleware implements Controller {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken)
      if (account) {
        return ok({ accountId: account.id })
      }
    }
    return forbiden(new AccessDeniedError())
  }
}
