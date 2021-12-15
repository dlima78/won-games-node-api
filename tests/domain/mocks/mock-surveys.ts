import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '../usecases'
import faker from 'faker'

export const mockSurveys = (): SurveyModel[] => ([{
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
}, {
  id: 'other_id',
  question: 'other_question',
  answers: [{
    image: 'other_image',
    answer: 'other_answer'
  }],
  date: new Date()
}])

export const mockSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }],
  date: new Date()
})

export const mockSurveyParams = (): AddSurveyParams => ({
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
