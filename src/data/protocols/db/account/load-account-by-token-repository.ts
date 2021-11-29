import { AccountModel } from '@/domain/models/account'

export interface LoadAccountByTokenRepository {
  loadByToken: (value: string, role?: string) => Promise<AccountModel>
}
