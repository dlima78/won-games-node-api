import { DbAuthentication } from '@/data/usecases'
import { AccountModel } from '@/domain/models/account'
import faker from 'faker'
import { LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateAccessTokenRepository } from '@/data/protocols'
import { AuthenticationModel } from '@/domain/usecases'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password'
})

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositorySpy()
}

const makeFakeEncrypter = (): Encrypter => {
  class EncrypterSpy implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new EncrypterSpy()
}

const makeFakeAcuthentication = (): AuthenticationModel => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
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
  encrypterSpy: Encrypter
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()
  const encrypterSpy = makeFakeEncrypter()
  const hashComparerSpy = makeHashComparer()
  const loadAccountByEmailRepositorySpy = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositorySpy, hashComparerSpy, encrypterSpy, updateAccessTokenRepositorySpy)
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('Name of the group', () => {
  test('Should call LoadAccountByEmailRepository with correct email ', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
    const email = faker.internet.email()
    await sut.auth({
      email: email,
      password: faker.internet.password()
    })

    expect(loadSpy).toHaveBeenLastCalledWith(email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAcuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValueOnce(null)
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

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterSpy } = makeSut()
    const generateSpy = jest.spyOn(encrypterSpy, 'encrypt')
    const password = faker.internet.password()
    await sut.auth({
      email: faker.internet.email(),
      password: password
    })

    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAcuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return token on success', async () => {
    const { sut } = makeSut()
    const password = faker.internet.password()
    const accessToken = await sut.auth({
      email: faker.internet.email(),
      password: password
    })

    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
    const password = faker.internet.password()
    await sut.auth({
      email: faker.internet.email(),
      password: password
    })

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAcuthentication())
    await expect(promise).rejects.toThrow()
  })
})
