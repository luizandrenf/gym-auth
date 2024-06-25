import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { registerUseCase } from '@/use-cases/register'

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const requestBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = requestBodySchema.parse(request.body)

  try {
    await registerUseCase({ name, email, password })
  } catch (err) {
    reply.status(409).send()
  }

  return reply.status(201).send()
}
