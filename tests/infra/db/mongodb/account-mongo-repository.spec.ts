import 'dotenv/config'
import { MongoHelper, AccountMongoRepository } from '@/infra/db/mongodb'
import { Collection } from 'mongodb'
import { mockAccountParams } from '@/../tests/domain/mocks'
import faker from 'faker'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const accountParams = mockAccountParams()
      const account = await sut.add(accountParams)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toEqual(accountParams.name)
      expect(account.email).toEqual(accountParams.email)
      expect(account.password).toEqual(accountParams.password)
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account if loadByEmail succeeds', async () => {
      const accountParams = mockAccountParams()
      await accountCollection.insertOne(accountParams)
      const sut = makeSut()
      const account = await sut.loadByEmail(accountParams.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toEqual(accountParams.name)
      expect(account.email).toEqual(accountParams.email)
      expect(account.password).toEqual(accountParams.password)
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const accountParams = mockAccountParams()
      const sut = makeSut()
      const res = await accountCollection.insertOne(accountParams)
      const fakeAccount = res.ops[0]
      expect(fakeAccount.accesssToken).toBeFalsy()
      await sut.updateAccessToken(fakeAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    let name = faker.name.findName()
    let email = faker.internet.email()
    let password = faker.internet.password()
    let accessToken = faker.datatype.uuid()

    beforeEach(() => {
      name = faker.name.findName()
      email = faker.internet.email()
      password = faker.internet.password()
      accessToken = faker.datatype.uuid()
    })
    test('Should return an account if loadByToken without role', async () => {
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken
      })
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toEqual(name)
      expect(account.email).toEqual(email)
      expect(account.password).toEqual(password)
    })

    test('Should return an account if loadByToken with admin role', async () => {
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin'
      })
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toEqual(name)
      expect(account.email).toEqual(email)
      expect(account.password).toEqual(password)
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin'
      })
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toEqual(name)
      expect(account.email).toEqual(email)
      expect(account.password).toEqual(password)
    })

    test('Should return null on loadByToken if invalid role', async () => {
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken
      })
      const sut = makeSut()
      const account = await sut.loadByToken(accessToken, 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
})
