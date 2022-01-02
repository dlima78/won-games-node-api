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
let accountId: string

describe('DbLoadSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  afterEach(() => {
    surveyId = faker.datatype.uuid()
    accountId = faker.datatype.uuid()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    await sut.load(surveyId, accountId)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError)
    const promise = sut.load(surveyId, accountId)
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepository } = makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    await sut.load(surveyId, accountId)
    expect(loadSurveyByIdRepository.id).toBe(surveyId)
  })

  test('Should return surveyResultModel with all answers with count 0 if if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepository } = makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    const { surveyModel } = loadSurveyByIdRepository
    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual({
      surveyId: surveyModel.id,
      question: surveyModel.question,
      date: surveyModel.date,
      answers: surveyModel.answers.map(answer => Object.assign({}, answer, {
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    })
  })

  test('Should return SurveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load(surveyId, accountId)
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResultModel)
  })
})
