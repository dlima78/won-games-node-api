import { DbAuthentication } from '@/data/usecases'
import { AccountModel } from '@/domain/models/account'
import faker from 'faker'
import { LoadAccountByEmailRepository, HashComparer, TokenGenerator } from '@/data/protocols'
import { AuthenticationModel } from '@/domain/usecases'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password'
})

const makeFakeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorSpy implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new TokenGeneratorSpy()
}

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
  tokenGeneratorSpy: TokenGenerator
}

const makeSut = (): SutTypes => {
  const tokenGeneratorSpy = makeFakeTokenGenerator()
  const hashComparerSpy = makeHashComparer()
  const loadAccountByEmailRepositorySpy = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositorySpy, hashComparerSpy, tokenGeneratorSpy)
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    tokenGeneratorSpy
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

  test('Should call HashCompare with correct values ', async () => {
    const { sut, hashComparerSpy } = makeSut()
    const compareSpy = jest.spyOn(hashComparerSpy, 'compare')
    const password = faker.internet.password()
    await sut.auth({
      email: faker.internet.email(),
      password: password
    })

    expect(compareSpy).toHaveBeenCalledWith(password, makeFakeAccount().password)
  })

  test('Should throw if HashCompare throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAcuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashCompare returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(makeFakeAcuthentication())

    expect(accessToken).toBeNull()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorSpy, 'generate')
    const password = faker.internet.password()
    await sut.auth({
      email: faker.internet.email(),
      password: password
    })

    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    jest.spyOn(tokenGeneratorSpy, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAcuthentication())
    await expect(promise).rejects.toThrow()
  })
})
