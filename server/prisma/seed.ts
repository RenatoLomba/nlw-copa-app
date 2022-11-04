import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error'],
})

async function main() {
  const owner = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      avatarUrl: 'https://github.com/RenatoLomba.png',
    },
  })

  const user = await prisma.user.create({
    data: {
      name: 'Diego Fernandes',
      email: 'diego3g@gmail.com',
      avatarUrl: 'https://github.com/diego3g.png',
    },
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL123',
      ownerId: owner.id,
      participants: {
        createMany: {
          data: [{ userId: owner.id }, { userId: user.id }],
        },
      },
    },
  })

  await prisma.game.create({
    data: {
      date: '2022-11-06T12:00:00.083Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    },
  })

  const game = await prisma.game.create({
    data: {
      date: '2022-11-07T12:00:00.083Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: { userId: owner.id, poolId: pool.id },
            },
          },
        },
      },
    },
  })

  await prisma.guess.create({
    data: {
      firstTeamPoints: 1,
      secondTeamPoints: 2,
      game: {
        connect: {
          id: game.id,
        },
      },

      participant: {
        connect: {
          userId_poolId: { userId: user.id, poolId: pool.id },
        },
      },
    },
  })
}

main()
