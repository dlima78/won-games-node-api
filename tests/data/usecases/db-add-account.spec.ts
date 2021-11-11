import { DbAddAccount } from '@/data/usecases'
import { Encrypter } from '@/data/protocols/cryptography/encrypter'

const makeEncrypter = (): Encrypter => {
  class EncrypterSpy implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new EncrypterSpy()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterSpy: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterSpy = makeEncrypter()
  const sut = new DbAddAccount(encrypterSpy)
  return {
    sut,
    encrypterSpy
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterSpy } = makeSut()
    const encryptSpy = jest.spyOn(encrypterSpy, 'encrypt')
    const accountData = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
