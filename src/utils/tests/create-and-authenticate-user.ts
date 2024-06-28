import { FastifyInstance } from 'fastify'
import request from 'supertest'

export const createAndAuthenticateUser = async (app: FastifyInstance) => {
  await request(app.server).post('/users').send({
    name: 'Jhon Doe',
    email: 'jhondoe@gmail.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'jhondoe@gmail.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
