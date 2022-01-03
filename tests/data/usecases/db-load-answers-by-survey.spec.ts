import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { throwError } from '@/tests/domain/mocks'
import { LoadAnswersBySurveyRepositorySpy } from '@/tests/data/mocks'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy)
  return {
    sut,
    loadAnswersBySurveyRepositorySpy
  }
}

let surveyId: string

describe('DbLoadSurveyById', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })
  test('Should call LoadAnswersBySurveyRepository with correct id', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    await sut.loadAnswers(surveyId)
    expect(loadAnswersBySurveyRepositorySpy.id).toBe(surveyId)
  })

  test('Should return Answers on success ', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([
      loadAnswersBySurveyRepositorySpy.result[0],
      loadAnswersBySurveyRepositorySpy.result[1]
    ])
  })

  test('Should return empty array if LoadSurveyByIdRepository retuns empty', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    loadAnswersBySurveyRepositorySpy.result = []
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers')
      .mockImplementationOnce(throwError)
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
