import '@fastify/jwt'

declare module '@fastify/jwt' {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-unused-vars
  interface FastifyJWT {
    user: {
      sub: string
      name: string
      avatarUrl: string
    }
  }
}
