import { AddSurveyController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeAddSurveyValidation } from '@/main/factories/controllers'
import { makeDbAddSurvey } from '@/main/factories/usecases'
import { makeLogControllerDecorator } from '@/main/factories/decorator'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(controller)
}
