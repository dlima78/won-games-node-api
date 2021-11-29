import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { Decrypter } from '@/data/protocols/cryptography'
import { DbLoadAccountByToken } from '@/data/usecases'
import { AccountModel } from '@/domain/models/account'
import { LoadAccountByTokenRepository } from '@/data/protocols'

const mockAccount = (): AccountModel => ({
  id: 'valid-id',
  name: 'valid-name',
  email: 'valid-mail@mail.com',
  password: 'valid-password'
})

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
    loadBytoken: (value: string, role: string) => Promise<AccountModel>
    async loadByToken (value: string, role: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByTokenRepositorySpy()
}
const makeDecrypter = (): Decrypter => {
  class DecrypterSpy implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve('any-token')
    }
  }
  return new DecrypterSpy()
}

type SutTypes = {
  sut: LoadAccountByToken
  decrypterSpy: Decrypter
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositorySpy = makeLoadAccountByTokenRepository()
  const decrypterSpy = makeDecrypter()
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
    jest.spyOn(decrypterSpy, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
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
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.load('any-token', 'any-role')
    expect(account).toBeNull()
  })
})
