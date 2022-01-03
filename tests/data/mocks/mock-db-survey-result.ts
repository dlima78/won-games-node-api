import { mockSurveyResultModel, mockSaveSurveyResultParams } from '@/tests/domain/mocks'
import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultParams = mockSaveSurveyResultParams()
  async save (data: SaveSurveyResultRepository.Params): Promise<void> {
    this.saveSurveyResultParams = data
    return await Promise.resolve()
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyResultModel = mockSurveyResultModel()
  surveyId: string
  accountId: string
  async loadBySurveyId (surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return await Promise.resolve(this.surveyResultModel)
  }
}
