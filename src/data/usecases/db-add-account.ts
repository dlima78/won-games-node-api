import { AddAccountRepository, Encrypter } from '@/data/protocols'
import { AddAccountModel } from '@/domain/usecases/add-account'

export class DbAddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRespository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<any> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.addAccountRespository.add({ ...accountData, password: hashedPassword })
    return ''
  }
}
