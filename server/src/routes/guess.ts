import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { authenticate } from '../plugins'
import { prisma } from '../prisma'

const createGuessBodySchema = z.object({
  firstTeamPoints: z.number().positive(),
  secondTeamPoints: z.number().positive(),
})

type CreateGuessBodyFields = z.infer<typeof createGuessBodySchema>

const createGuessParamsSchema = z.object({
  poolId: z.string().uuid(),
  gameId: z.string().uuid(),
})

type CreateGuessParamsFields = z.infer<typeof createGuessParamsSchema>

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.user.count()
    return { count }
  })

  fastify.post(
    '/pools/:poolId/games/:gameId/guesses',
    { onRequest: [authenticate] },
    async (request, reply) => {
      let createGuessBodyFields = {} as CreateGuessBodyFields
      let createGuessParamsFields = {} as CreateGuessParamsFields

      try {
        createGuessBodyFields = createGuessBodySchema.parse(request.body)
        createGuessParamsFields = createGuessParamsSchema.parse(request.params)
      } catch (ex) {
        return reply.status(400).send((ex as { message: string }).message)
      }

      const { firstTeamPoints, secondTeamPoints } = createGuessBodyFields
      const { gameId, poolId } = createGuessParamsFields
      const userId = request.user.sub

      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId,
          },
        },
      })

      if (!participant) {
        return reply
          .status(400)
          .send({ message: 'User is not participant of this pool' })
      }

      const participantId = participant.id

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      })

      if (!game) {
        return reply.status(400).send({
          message: 'Game does not exists',
        })
      }

      if (game.date < new Date()) {
        return reply.status(400).send({
          message: 'The game already finished',
        })
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            gameId,
            participantId,
          },
        },
      })

      if (guess) {
        return reply.status(400).send({
          message: 'Participant already have guessed this game on this pool',
        })
      }

      const createdGuess = await prisma.guess.create({
        data: {
          firstTeamPoints,
          secondTeamPoints,
          gameId,
          participantId,
        },
      })

      return reply.status(201).send(createdGuess)
    },
  )
}
