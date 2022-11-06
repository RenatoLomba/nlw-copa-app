import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { authenticate } from '../plugins'
import { prisma } from '../prisma'

const sessionSchemaValidation = z.object({
  access_token: z.string(),
})

type SessionFields = z.infer<typeof sessionSchemaValidation>

const userInfoSchemaValidation = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string().url(),
})

type UserInfoFields = z.infer<typeof userInfoSchemaValidation>

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/me', { onRequest: [authenticate] }, async (request, reply) => {
    return { user: request.user }
  })

  fastify.post('/session', async (request, reply) => {
    let sessionFields = {} as SessionFields

    try {
      sessionFields = sessionSchemaValidation.parse(request.body)
    } catch (ex: any) {
      return reply.status(400).send(ex.message)
    }

    const { access_token: accessToken } = sessionFields

    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      return reply.status(userResponse.status).send(userData)
    }

    let userInfoFields = {} as UserInfoFields

    try {
      userInfoFields = userInfoSchemaValidation.parse(userData)
    } catch (ex: any) {
      return reply.status(400).send(ex.message)
    }

    let user = await prisma.user.findUnique({
      where: { googleId: userInfoFields.id },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfoFields.id,
          email: userInfoFields.email,
          name: userInfoFields.name,
          avatarUrl: userInfoFields.picture,
        },
      })
    }

    const token = fastify.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: '30m',
      },
    )

    return {
      accessToken: token,
      user: {
        sub: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    }
  })
}
