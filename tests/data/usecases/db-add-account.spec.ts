import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '@/data/protocols'
import { DbAddAccount } from '@/data/usecases'
import faker from 'faker'
import { mockAccount, mockAccountParams, throwError } from '@/tests/domain/mocks'
import { mockAddAccountRespository, mockHasher, mockLoadAccountByEmailRepository } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: Hasher
  addAccountRepositorySpy: AddAccountRepository
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const addAccountRepositorySpy = mockAddAccountRespository()
  const hasherSpy = mockHasher()
  const loadAccountByEmailRepositorySpy = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValue(new Promise(resolve => resolve(null)))
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const hashSpy = jest.spyOn(hasherSpy, 'hash')
    const accountData = mockAccountParams()
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash')
      .mockImplementationOnce(throwError)
    const promise = sut.add(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    const adddSpy = jest.spyOn(addAccountRepositorySpy, 'add')
    const accountData = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    await sut.add(accountData)
    expect(adddSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAccountParams())
    expect(account).toEqual(mockAccount())
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(mockAccount())))
    const account = await sut.add(mockAccountParams())
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email ', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
    const email = faker.internet.email()
    await sut.add({
      name: faker.name.firstName(),
      email,
      password: faker.internet.password()
    })

    expect(loadSpy).toHaveBeenLastCalledWith(email)
  })
})
