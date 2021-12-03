import { SurveyResultModel } from '@/domain/models'

export type SaveSurveyResultModel = {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
