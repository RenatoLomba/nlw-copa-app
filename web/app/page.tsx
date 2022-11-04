import Image from 'next/image'

import { PoolForm } from '../components/pool-form'
import nlwCopaPreview from '../public/app-nlw-copa-preview.png'
import nlwCopaUsersAvatar from '../public/users-avatar-example.png'

async function getPoolsCount(): Promise<{ count: number }> {
  const res = await fetch('http://localhost:3333/pools/count', {
    cache: 'no-store',
  })
  return res.json()
}

async function getUsersCount(): Promise<{ count: number }> {
  const res = await fetch('http://localhost:3333/users/count', {
    cache: 'no-store',
  })
  return res.json()
}

async function getGuessesCount(): Promise<{ count: number }> {
  const res = await fetch('http://localhost:3333/guesses/count', {
    cache: 'no-store',
  })
  return res.json()
}

export default async function Home() {
  const { count: poolsCount } = await getPoolsCount()
  const { count: usersCount } = await getUsersCount()
  const { count: guessesCount } = await getGuessesCount()

  return (
    <div
      className="
        max-w-[1124px] w-full h-screen mx-auto
        grid grid-cols-2 items-center gap-28
      "
    >
      <main>
        <Image
          src="/logo.svg"
          alt="Logotipo da NLW Copa"
          width={213}
          height={41}
        />

        <h1
          className="
            mt-16 text-white text-5xl
            font-bold leading-tight
          "
        >
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image
            src={nlwCopaUsersAvatar}
            alt="Avatares dos usuários utilizando o app da NLW Copa"
          />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{usersCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <PoolForm />

        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div
          className="
            mt-10 pt-10 border-t border-gray-600
            flex justify-between items-stretch text-gray-100
          "
        >
          <div className="flex items-center gap-6">
            <Image src="/icon-check.svg" alt="" width={40} height={41} />

            <div className="flex flex-col gap-1 justify-between">
              <strong className="text-2xl">+{poolsCount}</strong>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-full bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src="/icon-check.svg" alt="" width={40} height={41} />

            <div className="flex flex-col gap-1 justify-between">
              <strong className="text-2xl">+{guessesCount}</strong>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={nlwCopaPreview}
        alt="Prévia da aplicação mobile da NLW Copa"
      />
    </div>
  )
}
