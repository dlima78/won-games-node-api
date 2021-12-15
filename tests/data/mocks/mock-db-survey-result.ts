import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { mockSurveyResult } from '@/tests/domain/mocks'
import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyRepositorySpy implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new SaveSurveyRepositorySpy()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyRepositorySpy implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new LoadSurveyRepositorySpy()
}
