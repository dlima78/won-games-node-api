import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { AccessDeniedError } from '@/presentation/errors'
import { forbiden } from '@/presentation/helpers/http-helper'

export class AuthMiddleware implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(forbiden(new AccessDeniedError()))
  }
}
