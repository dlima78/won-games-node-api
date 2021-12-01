import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from '@/infra/db/mongodb'
import faker from 'faker'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: faker.random.words(),
        answers: [{
          image: faker.image.imageUrl(),
          answer: faker.random.word()
        },
        {
          answer: faker.random.word()
        }],
        date: new Date()
      })
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })
})
