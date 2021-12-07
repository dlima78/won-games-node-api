import { SurveyModel } from '@/domain/models'
import { LoadSurveyById } from '@/domain/usecases'
import { mockSurvey } from '@/tests/domain/mocks'

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdSpy implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurvey())
    }
  }
  return new LoadSurveyByIdSpy()
}
