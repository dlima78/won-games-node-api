import { AddSurveyRepository } from '@/data/protocols'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { MongoHelper } from '@/infra/db/mongodb'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
