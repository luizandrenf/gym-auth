import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

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

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  })

  return reply.status(201).send()
}
