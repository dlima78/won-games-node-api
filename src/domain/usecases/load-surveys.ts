import { SurveyModel } from '@/domain/models'

export interface LoadSurveys {
  load: (acountId: string) => Promise<SurveyModel[]>
}
