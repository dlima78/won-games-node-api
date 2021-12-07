import { AccountModel } from '@/domain/models'
import { AddAccountParams } from '@/domain/usecases'
import faker from 'faker'

export const mockAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAccountParams = (): AddAccountParams => ({
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
