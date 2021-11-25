import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { AddSurvey } from '@/domain/models/add-survey'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(new Error())
      }

      const { question, answers } = httpRequest.body
      await this.addSurvey.add({
        question,
        answers
      })
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
