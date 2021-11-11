import { AddAccountModel } from '@/domain/usecases/add-account'
import { Encrypter } from '@/data/protocols/cryptography/encrypter'

export class DbAddAccount {
  constructor (private readonly encrypter: Encrypter) {}
  async add (account: AddAccountModel): Promise<any> {
    await this.encrypter.encrypt(account.password)
    return ''
  }
}
