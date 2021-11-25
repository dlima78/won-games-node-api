import { Controller, HttpRequest, Validation } from '@/presentation/protocols'
import faker from 'faker'
import { AddSurveyController } from '@/presentation/controllers'

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

type SutTypes = {
  sut: Controller
  validationSpy: Validation
}

const makeSut = (): SutTypes => {
  const validationSpy = makeValidation()
  const sut = new AddSurveyController(validationSpy)
  return {
    sut,
    validationSpy
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
})
