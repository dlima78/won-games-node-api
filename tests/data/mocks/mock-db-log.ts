import { LogErrorRepository } from '@/data/protocols'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositorySpy implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new LogErrorRepositorySpy()
}
