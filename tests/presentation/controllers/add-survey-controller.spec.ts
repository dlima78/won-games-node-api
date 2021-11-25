import { Controller, HttpRequest, Validation } from '@/presentation/protocols'
import faker from 'faker'
import { AddSurveyController } from '@/presentation/controllers'
import { badRequest } from '@/presentation/helpers/http-helper'
import { AddSurvey, AddSurveyModel } from '@/domain/models/add-survey'

const mockRequest = (): HttpRequest => ({
  body: {
    question: faker.random.word,
    answers: [{
      image: faker.image.animals,
      answer: faker.random.words
    }]
  }

})

const makeValidation = (): Validation => {
  class ValidationSpy implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationSpy()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveySpy implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveySpy()
}
type SutTypes = {
  sut: Controller
  validationSpy: Validation
  addSurveySpy: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationSpy = makeValidation()
  const addSurveySpy = makeAddSurvey()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)
  return {
    sut,
    validationSpy,
    addSurveySpy
  }
}

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values ', async () => {
    const { sut, validationSpy } = makeSut()
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values ', async () => {
    const { sut, addSurveySpy } = makeSut()
    const addSpy = jest.spyOn(addSurveySpy, 'add')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
