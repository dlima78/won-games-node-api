import { SaveSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeDbLoadSurveyById, makeDbSaveSurveyResult } from '@/main/factories/usecases'
import { makeLogControllerDecorator } from '@/main/factories/decorator'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
