import { AddSurvey, AddSurveyModel } from '@/domain/usecases/add-survey'
import { AddSurveyRepository } from '../protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (surveyData: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(surveyData)
  }
}
