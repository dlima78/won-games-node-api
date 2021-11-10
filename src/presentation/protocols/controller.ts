import { HttpRequest } from '@/presentation/protocols/http'

export interface Controller {
  handle: (httpRequest: HttpRequest) => any
}
