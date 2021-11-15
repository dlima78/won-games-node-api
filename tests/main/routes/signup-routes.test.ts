import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Eduardo',
        email: 'teste@test.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
  })
})
