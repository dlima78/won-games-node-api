import { SurveyModel } from '@/domain/models'
import { LoadSurveys } from '@/domain/usecases'
import { LoadSurveysController } from '@/presentation/controllers'
import MockDate from 'mockdate'

const mockSurveys = (): SurveyModel[] => ([{
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

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysSpy implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveysSpy()
}

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysSpy, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
