import { SaveSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeDbLoadAnswersBySurvey, makeDbSaveSurveyResult } from '@/main/factories/usecases'
import { makeLogControllerDecorator } from '@/main/factories/decorator'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadAnswersBySurvey(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
