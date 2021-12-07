import { Hasher, HashComparer, Encrypter, Decrypter } from '@/data/protocols'

export const mockHasher = (): Hasher => {
  class HasherSpy implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherSpy()
}

export const mockHashComparer = (): HashComparer => {
  class HashCompareSpy implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new HashCompareSpy()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterSpy implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new EncrypterSpy()
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterSpy implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve('any-token')
    }
  }
  return new DecrypterSpy()
}
