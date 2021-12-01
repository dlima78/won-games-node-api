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

  describe('load()', () => {
    test('Should loadAll surveys on success', async () => {
      const sut = makeSut()
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }, {
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }],
        date: new Date()
      }])
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })

    test('Should load empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
})
