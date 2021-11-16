import { LogErrorRepository } from '@/data/protocols'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import faker from 'faker'
import { serverError } from '@/presentation/helpers/http-helper'

const makeLogErrorRepositorySpy = (): LogErrorRepository => {
  class LogErrorRepositorySpy implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new LogErrorRepositorySpy()
}

const makeControllerSpy = (): Controller => {
  class ControllerSpy implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve({
        statusCode: 200,
        body: {
          name: 'Eduardo'
        }
      })
    }
  }
  return new ControllerSpy()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerSpy: Controller
  logErrorRepositorySpy: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const logErrorRepositorySpy = makeLogErrorRepositorySpy()
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
    const password = faker.internet.password()
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        name: faker.name.firstName(),
        password: password,
        passwordConfirmation: password
      }
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const password = faker.internet.password()
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        name: faker.name.firstName(),
        password: password,
        passwordConfirmation: password
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Eduardo'
      }
    })
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const password = faker.internet.password()

    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)

    const logSpy = jest.spyOn(logErrorRepositorySpy, 'log')
    jest.spyOn(controllerSpy, 'handle')
      .mockReturnValueOnce(new Promise(resolve => resolve(error)))

    const httpRequest = {
      body: {
        email: faker.internet.email(),
        name: faker.name.firstName(),
        password: password,
        passwordConfirmation: password
      }
    }

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
