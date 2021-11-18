import { DbAuthentication } from '@/data/usecases'
import { AccountModel } from '@/domain/models/account'
import faker from 'faker'
import { LoadAccountByEmailRepository } from '@/data/protocols'

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: 'any_id',
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
      return await Promise.resolve(account)
    }
  }
  return new LoadAccountByEmailRepositorySpy()
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepository

}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositorySpy)
  return {
    sut,
    loadAccountByEmailRepositorySpy
  }
}

describe('Name of the group', () => {
  test('Should call LoadAccountByEmailRepository with correct email ', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositorySpy, 'load')
    const email = faker.internet.email()
    await sut.auth({
      email: email,
      password: faker.internet.password()
    })

    expect(loadSpy).toHaveBeenLastCalledWith(email)
  })
})
