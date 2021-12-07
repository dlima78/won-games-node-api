import { AddSurvey, AddSurveyParams } from '@/domain/usecases/add-survey'
import { AddSurveyRepository } from '../protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (surveyData: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(surveyData)
  }
}
