import { SurveyModel } from '@/domain/models'
import { AddSurvey } from '../usecases'
import faker from 'faker'

export const mockSurveyModels = (): SurveyModel[] => ([{
  id: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [{
    image: faker.image.imageUrl(),
    answer: faker.random.word()
  }],
  date: new Date()
}, {
  id: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [{
    image: faker.image.imageUrl(),
    answer: faker.random.word()
  }],
  date: new Date()
}])

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [{
    answer: faker.random.word()
  }, {
    answer: faker.random.word(),
    image: faker.image.imageUrl()
  }],
  date: faker.date.recent()
})

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.words(4)
  },
  {
    image: faker.internet.url(),
    answer: faker.random.words(4)
  }],
  date: new Date()
})
