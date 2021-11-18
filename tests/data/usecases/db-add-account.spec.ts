import { AddAccountRepository, Hasher } from '@/data/protocols'
import { DbAddAccount } from '@/data/usecases'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'
import faker from 'faker'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

const makeAddAccountRespository = (): AddAccountRepository => {
  class AddAccountRepositorySpy implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountRepositorySpy()
}

const makeHasher = (): Hasher => {
  class HasherSpy implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherSpy()
}

interface SutTypes {
  sut: DbAddAccount
  hasherSpy: Hasher
  addAccountRepositorySpy: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const addAccountRepositorySpy = makeAddAccountRespository()
  const hasherSpy = makeHasher()
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy)
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const hashSpy = jest.spyOn(hasherSpy, 'hash')
    const accountData = makeFakeAccountData()
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
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
    jest.spyOn(addAccountRepositorySpy, 'add')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account if on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
