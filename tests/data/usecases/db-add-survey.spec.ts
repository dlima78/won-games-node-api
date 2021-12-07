import { AddSurveyParams } from '@/domain/usecases/add-survey'
import faker from 'faker'
import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'
import MockDate from 'mockdate'

const makeSurveyData = (): AddSurveyParams => ({
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

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositorySpy implements AddSurveyRepository {
    async add (data: AddSurveyParams): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new AddSurveyRepositorySpy()
}

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepository: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepository = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepository)
  return {
    sut,
    addSurveyRepository
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values ', async () => {
    const { sut, addSurveyRepository } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepository, 'add')
    const surveyData = makeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepository } = makeSut()
    jest.spyOn(addSurveyRepository, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})
