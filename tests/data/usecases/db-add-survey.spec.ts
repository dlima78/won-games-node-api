import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepository } from '../protocols/db/survey/add-survey-repository'
import { mockSurveyParams, throwError } from '@/tests/domain/mocks'
import MockDate from 'mockdate'
import { mockAddSurveyRepository } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepository: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepository = mockAddSurveyRepository()
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
    const surveyData = mockSurveyParams()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepository } = makeSut()
    jest.spyOn(addSurveyRepository, 'add')
      .mockImplementationOnce(throwError)
    const promise = sut.add(mockSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
