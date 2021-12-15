import { LogErrorRepository } from '@/data/protocols'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import faker from 'faker'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { mockAccount } from '@/tests/domain/mocks'
import { mockLogErrorRepository } from '@/tests/data/mocks'

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password()
  return {
    body: {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: password,
      passwordConfirmation: password
    }
  }
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeControllerSpy = (): Controller => {
  class ControllerSpy implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok(mockAccount()))
    }
  }
  return new ControllerSpy()
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: Controller
  logErrorRepositorySpy: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const logErrorRepositorySpy = mockLogErrorRepository()
  const controllerSpy = makeControllerSpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle ', async () => {
    const { sut, controllerSpy } = makeSut()
    const handleSpy = jest.spyOn(controllerSpy, 'handle')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositorySpy, 'logError')
    jest.spyOn(controllerSpy, 'handle')
      .mockReturnValueOnce(Promise.resolve(makeFakeServerError()))

    await sut.handle(mockRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
