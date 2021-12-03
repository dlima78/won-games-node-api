import { SurveyModel } from '@/domain/models'
import { LoadSurveyByIdRepository } from '@/data/protocols'
import MockDate from 'mockdate'
import { DbLoadSurveyById } from '@/data/usecases'

const mockSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurvey())
    }
  }
  return new LoadSurveyByIdRepositorySpy()
}

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = makeLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById')
    await sut.loadById('any_id')
    expect(loadByIdSpy).toBeCalledWith('any_id')
  })

  test('Should return Survey on success ', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(mockSurvey())
  })
})
