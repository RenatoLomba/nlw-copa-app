import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { authenticate } from '../plugins'
import { prisma } from '../prisma'

const getPoolGamesSchema = z.object({
  id: z.string().uuid(),
})

type GetPoolGamesFields = z.infer<typeof getPoolGamesSchema>

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/pools/:id/games',
    { onRequest: [authenticate] },
    async (request, reply) => {
      let getPoolGamesFields = {} as GetPoolGamesFields

      try {
        getPoolGamesFields = getPoolGamesSchema.parse(request.params)
      } catch (ex: unknown) {
        return reply.status(400).send((ex as { message: string }).message)
      }

      const { id: poolId } = getPoolGamesFields
      const userId = request.user.sub

      const games = await prisma.game.findMany({
        orderBy: {
          date: 'desc',
        },
        include: {
          guesses: {
            where: {
              participant: {
                userId,
                poolId,
              },
            },
          },
        },
      })

      return games?.map((game) => {
        return {
          ...game,
          guesses: undefined,
          guess: game.guesses.length > 0 ? game.guesses[0] : null,
        }
      })
    },
  )
}
