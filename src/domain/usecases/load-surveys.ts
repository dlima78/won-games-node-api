import { SurveyModel } from '@/domain/models'

export interface LoadSurveys {
  load: (acountId: string) => Promise<LoadSurveys.Result>
}

export namespace LoadSurveys {
  export type Result = SurveyModel[]
}
