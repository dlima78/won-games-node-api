import { SurveyModel } from '@/domain/models'
import { LoadSurveyById } from '@/domain/usecases'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { HttpRequest } from '@/presentation/protocols'

const mockSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})
const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdSpy implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurvey())
    }
  }
  return new LoadSurveyByIdSpy()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdSpy: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdSpy)
  return {
    sut,
    loadSurveyByIdSpy
  }
}

describe('SurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdSpy, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
