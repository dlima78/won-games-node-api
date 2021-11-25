import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel, AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const exists = await this.checkAccountByEmailRepository.loadByEmail(accountData.email)
    if (!exists) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
      return account
    }
    return null
  }
}
