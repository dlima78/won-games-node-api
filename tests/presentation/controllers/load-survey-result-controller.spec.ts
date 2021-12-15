import { LoadSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { HttpRequest } from '@/presentation/protocols'
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/tests/presentation/mocks'
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { throwError, mockSurveyResult } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdSpy: LoadSurveyById
  loadSurveyResultSpy: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = mockLoadSurveyById()
  const loadSurveyResultSpy = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyByIdSpy, loadSurveyResultSpy)
  return {
    sut,
    loadSurveyByIdSpy,
    loadSurveyResultSpy
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdSpy, 'loadById')
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultSpy, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 500 if LoadSurveResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResult()))
  })
})
