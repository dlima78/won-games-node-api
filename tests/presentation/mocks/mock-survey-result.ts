import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResult, SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'
import { mockSurveyResult } from '@/tests/domain/mocks'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultSpy implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new SaveSurveyResultSpy()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultSpy implements LoadSurveyResult {
    async load (surveyId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new LoadSurveyResultSpy()
}
