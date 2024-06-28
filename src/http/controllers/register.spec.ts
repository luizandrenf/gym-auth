import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const respose = await request(app.server).post('/users').send({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    })

    expect(respose.statusCode).toEqual(201)
  })
})
