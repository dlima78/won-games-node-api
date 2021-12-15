import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from '@/data/protocols'
import { DbLoadSurveyResult } from '@/data/usecases'
import { mockLoadSurveyResultRepository, mockLoadSurveyByIdRepository } from '@/tests/data/mocks'
import MockDate from 'mockdate'
import { throwError, mockSurveyResult } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepository
  loadSurveyByIdRepository: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepository = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepository)
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepository
  }
}

describe('DbLoadSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyResultRepository with correct  surveyId', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError)
    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepository } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepository, 'loadById')
    await sut.load('any_survey_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return surveyResultModel with all answers with count 0 if if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResult())
  })

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResult())
  })
})
