import { DbAuthentication } from '@/data/usecases'
import faker from 'faker'
import { LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateAccessTokenRepository } from '@/data/protocols'
import { mockAccount, throwError } from '@/tests/domain/mocks'
import { mockAuthenticationParams, mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepository
  hashComparerSpy: HashComparer
  encrypterSpy: Encrypter
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const updateAccessTokenRepositorySpy = mockUpdateAccessTokenRepository()
  const encrypterSpy = mockEncrypter()
  const hashComparerSpy = mockHashComparer()
  const loadAccountByEmailRepositorySpy = mockLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositorySpy, hashComparerSpy, encrypterSpy, updateAccessTokenRepositorySpy)
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('DbAuthentication Usecase', () => {
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
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
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

    expect(compareSpy).toHaveBeenCalledWith(password, mockAccount().password)
  })

  test('Should throw if HashCompare throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashCompare returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(mockAuthenticationParams())

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
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
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
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
