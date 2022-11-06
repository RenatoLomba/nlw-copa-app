import Fastify from 'fastify'

import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import {
  authRoutes,
  gameRoutes,
  guessRoutes,
  poolRoutes,
  userRoutes,
} from './routes'

async function bootstrap() {
  if (!process.env.JWT_SECRET) {
    throw new Error('Environment variable "JWT_SECRET" is not defined')
  }

  const fastify = Fastify()

  await fastify.register(cors, {
    origin: true,
  })

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
  })

  await fastify.register(poolRoutes)
  await fastify.register(guessRoutes)
  await fastify.register(userRoutes)
  await fastify.register(authRoutes)
  await fastify.register(gameRoutes)

  await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()
