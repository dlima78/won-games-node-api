import request from 'supertest'
import app from '@/main/config/app'

describe('SignUp Routes', () => {
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
