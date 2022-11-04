import Fastify from 'fastify'

import cors from '@fastify/cors'

import { createPoolHandler } from './handlers/create-pool.handler'
import { prisma } from './prisma'

async function bootstrap() {
  const fastify = Fastify()

  await fastify.register(cors, {
    origin: true,
  })

  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()
    return { count }
  })

  fastify.get('/users/count', async () => {
    const count = await prisma.user.count()
    return { count }
  })

  fastify.get('/guesses/count', async () => {
    const count = await prisma.user.count()
    return { count }
  })

  fastify.post('/pools', createPoolHandler)

  await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()
