import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { Decrypter } from '@/data/protocols/cryptography'
import { DbLoadAccountByToken } from '@/data/usecases'

const makeDecrypter = (): Decrypter => {
  class DecrypterSpy implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve('any-value')
    }
  }
  return new DecrypterSpy()
}

type SutTypes = {
  sut: LoadAccountByToken
  decrypterSpy: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterSpy = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterSpy)
  return {
    sut,
    decrypterSpy
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterSpy } = makeSut()
    const decryptSpy = jest.spyOn(decrypterSpy, 'decrypt')
    await sut.load('any-token')
    expect(decryptSpy).toHaveBeenCalledWith('any-token')
  })
})
