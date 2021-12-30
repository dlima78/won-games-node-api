import { DbLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyResultRepositorySpy, LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import MockDate from 'mockdate'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepository: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepository = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepository)
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepository
  }
}

let surveyId: string

describe('DbLoadSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  afterEach(() => {
    surveyId = faker.datatype.uuid()
  })

  test('Should call LoadSurveyResultRepository with correct  surveyId', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    await sut.load(surveyId)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError)
    const promise = sut.load(surveyId)
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepository } = makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    await sut.load(surveyId)
    expect(loadSurveyByIdRepository.id).toBe(surveyId)
  })

  test('Should return surveyResultModel with all answers with count 0 if if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepository } = makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    const { surveyModel } = loadSurveyByIdRepository
    const surveyResult = await sut.load(surveyId)
    expect(surveyResult).toEqual({
      surveyId: surveyModel.id,
      question: surveyModel.question,
      date: surveyModel.date,
      answers: surveyModel.answers.map(answer => Object.assign({}, answer, {
        count: 0,
        percent: 0
      }))
    })
  })

  test('Should return SurveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load(surveyId)
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResultModel)
  })
})
