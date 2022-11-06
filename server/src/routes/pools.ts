import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import ShortUniqueId from 'short-unique-id'
import { z } from 'zod'

import { authenticate } from '../plugins'
import { prisma } from '../prisma'

const createPoolSchema = z.object({
  title: z.string().min(1),
})

type CreatePoolFields = z.infer<typeof createPoolSchema>

const joinPoolSchema = z.object({
  code: z.string(),
})

type JoinPoolFields = z.infer<typeof joinPoolSchema>

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
      } catch (ex: unknown) {
        return reply.status(400).send((ex as { message: string }).message)
      }

      const { title } = createPoolFields

      const generateCode = new ShortUniqueId({ length: 6 })
      const code = String(generateCode()).toUpperCase()

      let ownerId: string | null = null

      try {
        await request.jwtVerify()

        ownerId = request.user.sub
      } catch (ex) {}

      try {
        await prisma.pool.create({
          data: {
            title,
            code,
            ownerId,

            ...(ownerId
              ? {
                  participants: {
                    create: {
                      userId: ownerId,
                    },
                  },
                }
              : {}),
          },
        })
      } catch (ex: unknown) {
        return reply.status(500).send((ex as { message: string }).message)
      }

      return reply.status(201).send({ code })
    },
  )

  fastify.post(
    '/pools/join',
    { onRequest: [authenticate] },
    async (request, reply) => {
      let joinPoolFields = {} as JoinPoolFields

      try {
        joinPoolFields = joinPoolSchema.parse(request.body)
      } catch (ex: unknown) {
        return reply.status(400).send((ex as { message: string }).message)
      }

      const { code } = joinPoolFields

      const pool = await prisma.pool.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId: request.user.sub,
            },
          },
        },
      })

      if (!pool) {
        return reply.status(400).send({ message: 'Pool not found' })
      }

      if (pool.participants.length > 0) {
        return reply
          .status(400)
          .send({ message: 'User is already participating in this pool' })
      }

      await prisma.participant.create({
        data: {
          poolId: pool.id,
          userId: request.user.sub,
        },
      })

      if (!pool.ownerId) {
        await prisma.pool.update({
          where: { id: pool.id },
          data: {
            ownerId: request.user.sub,
          },
        })
      }

      return reply.status(201).send()
    },
  )
}
