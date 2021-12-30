import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { mockSurveyResultModel, mockSaveSurveyResultParams } from '@/tests/domain/mocks'
import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultParams = mockSaveSurveyResultParams()
  async save (data: SaveSurveyResultParams): Promise<void> {
    this.saveSurveyResultParams = data
    return await Promise.resolve()
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyResultModel = mockSurveyResultModel()
  surveyId: string
  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    return await Promise.resolve(this.surveyResultModel)
  }
}
