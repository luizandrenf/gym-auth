import { FastifyRequest, FastifyReply } from 'fastify'

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send()
}
