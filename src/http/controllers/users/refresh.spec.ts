import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    })

    const authRespose = await request(app.server).post('/sessions').send({
      email: 'jhondoe@gmail.com',
      password: '123456',
    })

    const cookies = authRespose.get('Set-Cookie')

    const respose = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(respose.statusCode).toEqual(200)
    expect(respose.body).toEqual({
      token: expect.any(String),
    })
    expect(respose.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
