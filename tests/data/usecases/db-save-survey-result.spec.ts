import { SaveSurveyResultRepository } from '@/data/protocols'
import { DbSaveSurveyResult } from '@/data/usecases'
import { SaveSurveyResultModel } from '@/domain/usecases'
import { SurveyResultModel } from '@/domain/models'
import MockDate from 'mockdate'

const mockSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_surveyId',
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date()
})

const makeSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: 'any_surveyId',
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date()
})

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyRepositorySpy implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResult())
    }
  }
  return new SaveSurveyRepositorySpy()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositorySpy: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositorySpy)
  return {
    sut,
    saveSurveyResultRepositorySpy
  }
}

describe('DbSaveSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyRepository with correct valeus', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositorySpy, 'save')
    await sut.save(makeSurveyResultData())
    expect(saveSpy).toHaveBeenCalledWith(makeSurveyResultData())
  })

  test('Should throw if SaveSurveyRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(saveSurveyResultRepositorySpy, 'save')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.save(makeSurveyResultData())
    await expect(promise).rejects.toThrow()
  })
})
