import { LoadSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeDbCheckSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases'
import { makeLogControllerDecorator } from '@/main/factories/decorator'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult())
  return makeLogControllerDecorator(controller)
}
