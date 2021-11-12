import { AddAccountRepository, Encrypter } from '@/data/protocols'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'

export class DbAddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRespository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRespository.add({ ...accountData, password: hashedPassword })
    return account
  }
}
