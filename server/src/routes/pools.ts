import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import ShortUniqueId from 'short-unique-id'
import { z } from 'zod'

import { prisma } from '../prisma'

const createPoolSchema = z.object({
  title: z.string().min(1),
})

type CreatePoolFields = z.infer<typeof createPoolSchema>

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()
    return { count }
  })

  fastify.post(
    '/pools',
    async (request: FastifyRequest, reply: FastifyReply) => {
      let createPoolFields = {} as CreatePoolFields

      try {
        createPoolFields = createPoolSchema.parse(request.body)
      } catch (ex: any) {
        return reply.status(400).send(ex.message)
      }

      const { title } = createPoolFields

      const generateCode = new ShortUniqueId({ length: 6 })
      const code = String(generateCode()).toUpperCase()

      try {
        await prisma.pool.create({
          data: {
            title,
            code,
          },
        })
      } catch (ex: any) {
        return reply.status(500).send(ex.message)
      }

      return reply.status(201).send({ code })
    },
  )
}
