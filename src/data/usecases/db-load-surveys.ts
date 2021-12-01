import { SurveyModel } from '@/domain/models'
import { LoadSurveys } from '@/domain/usecases'
import { LoadSurveysRepository } from '../protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll()
    return null
  }
}
