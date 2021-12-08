import { LoadAccountByToken } from '@/domain/usecases'
import { Decrypter } from '@/data/protocols/cryptography'
import { DbLoadAccountByToken } from '@/data/usecases'
import { LoadAccountByTokenRepository } from '@/data/protocols'
import { mockAccount, throwError } from '@/tests/domain/mocks'
import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/tests/data/mocks'

type SutTypes = {
  sut: LoadAccountByToken
  decrypterSpy: Decrypter
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositorySpy = mockLoadAccountByTokenRepository()
  const decrypterSpy = mockDecrypter()
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterSpy } = makeSut()
    const decryptSpy = jest.spyOn(decrypterSpy, 'decrypt')
    await sut.load('any-token', 'any-role')
    expect(decryptSpy).toHaveBeenCalledWith('any-token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load('any-token', 'any-role')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
    await sut.load('any-token', 'any-role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any-token', 'any-role')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load('any-token', 'any-role')
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any-token', 'any-role')
    expect(account).toEqual(mockAccount())
  })

  test('Should returns null if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const account = await sut.load('any-token', 'any-role')
    expect(account).toBeNull()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(throwError)
    const promise = sut.load('any-token', 'any-role')
    await expect(promise).rejects.toThrow()
  })
})
