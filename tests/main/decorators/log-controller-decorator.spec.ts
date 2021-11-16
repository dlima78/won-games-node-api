import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import faker from 'faker'

const makeControllerSpy = (): Controller => {
  class ControllerSpy implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve({
        statusCode: 200,
        body: {}
      })
    }
  }
  return new ControllerSpy()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerSpy: Controller
}

const makeSut = (): SutTypes => {
  const controllerSpy = makeControllerSpy()
  const sut = new LogControllerDecorator(controllerSpy)
  return {
    sut,
    controllerSpy
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
})
