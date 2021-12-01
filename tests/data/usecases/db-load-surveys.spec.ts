import { LoadSurveysRepository } from '@/data/protocols/db'
import { SurveyModel } from '@/domain/models'
import { DbLoadSurveys } from '@/data/usecases'
import { LoadSurveys } from '@/domain/usecases'

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

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositorySpy implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveys())
    }
  }
  return new LoadSurveysRepositorySpy()
}

type SutTypes = {
  sut: LoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)
  return {
    sut,
    loadSurveysRepositorySpy
  }
}

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository ', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositorySpy, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })
})
