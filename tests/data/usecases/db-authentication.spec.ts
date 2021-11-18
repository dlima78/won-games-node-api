import { DbAuthentication } from '@/data/usecases'
import { AccountModel } from '@/domain/models/account'
import faker from 'faker'
import { LoadAccountByEmailRepository } from '@/data/protocols'
import { AuthenticationModel } from '@/domain/usecases'
import { HashComparer } from '@/data/protocols/cryptography'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password'
})

const makeFakeAcuthentication = (): AuthenticationModel => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByEmailRepositorySpy()
}

const makeHashComparer = (): HashComparer => {
  class HashCompareSpy implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new HashCompareSpy()
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepository
  hashComparerSpy: HashComparer

}

const makeSut = (): SutTypes => {
  const hashComparerSpy = makeHashComparer()
  const loadAccountByEmailRepositorySpy = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositorySpy, hashComparerSpy)
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy
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

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAcuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'load').mockReturnValueOnce(null)
    const email = faker.internet.email()
    const accessToken = await sut.auth({
      email: email,
      password: faker.internet.password()
    })

    expect(accessToken).toBeNull()
  })

  test('Should call HashCompare with correct password ', async () => {
    const { sut, hashComparerSpy } = makeSut()
    const compareSpy = jest.spyOn(hashComparerSpy, 'compare')
    const password = faker.internet.password()
    await sut.auth({
      email: faker.internet.email(),
      password: password
    })

    expect(compareSpy).toHaveBeenLastCalledWith(password, makeFakeAccount().password)
  })
})
