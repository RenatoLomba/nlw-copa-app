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

const getPoolSchema = z.object({
  id: z.string().uuid(),
})

type GetPoolFields = z.infer<typeof getPoolSchema>

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

  fastify.get('/pools', { onRequest: [authenticate] }, async (request) => {
    return await prisma.pool.findMany({
      include: {
        owner: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
        participants: {
          take: 4,
          select: {
            id: true,
            user: {
              select: {
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      where: {
        participants: {
          some: {
            userId: request.user.sub,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  })

  fastify.get(
    '/pools/:id',
    { onRequest: [authenticate] },
    async (request, reply) => {
      let getPoolFields = {} as GetPoolFields

      try {
        getPoolFields = getPoolSchema.parse(request.params)
      } catch (ex: unknown) {
        return reply.status(400).send((ex as { message: string }).message)
      }

      const { id } = getPoolFields

      const pool = await prisma.pool.findUnique({
        include: {
          owner: {
            select: {
              name: true,
              avatarUrl: true,
            },
          },
          participants: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        where: {
          id,
        },
      })

      if (!pool) {
        return reply.status(400).send({ message: 'Pool not found' })
      }

      if (!pool.participants.some((p) => p.user.id === request.user.sub)) {
        return reply
          .status(400)
          .send({ message: 'User does not have access to this pool' })
      }

      return pool
    },
  )
}
