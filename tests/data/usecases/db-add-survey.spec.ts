import { AddSurvey, AddSurveyModel } from '@/domain/usecases/add-survey'
import faker from 'faker'
import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'

const makeSurveyData = (): AddSurveyModel => ({
  question: faker.random.words(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.words(4)
  },
  {
    image: faker.internet.url(),
    answer: faker.random.words(4)
  }]
})

const makeAddsurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositorySpy implements AddSurveyRepository {
    async add (data: AddSurveyModel): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new AddSurveyRepositorySpy()
}

type SutTypes = {
  sut: AddSurvey
  addSurveyRepository: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepository = makeAddsurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepository)
  return {
    sut,
    addSurveyRepository
  }
}

describe('DbAddSurvey Usecase', () => {
  test('Should call AddSurveyRepository with correct values ', async () => {
    const { sut, addSurveyRepository } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepository, 'add')
    const surveyData = makeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
})
