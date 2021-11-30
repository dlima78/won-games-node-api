import { AddSurveyController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeAddSurveyValidation } from '@/main/factories/controllers'
import { makeDbAddSurvey } from '../usecases'

export const makeAddSurveyController = (): Controller => {
  return new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
}
