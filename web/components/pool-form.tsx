'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

async function createPool(
  title: string,
  onSuccess?: (data: { code: string }) => void,
  onError?: (err: unknown) => void,
) {
  const res = await fetch('http://localhost:3333/pools', {
    method: 'POST',
    body: JSON.stringify({ title }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  if (res.status !== 201) {
    onError?.(data)
    return
  }

  onSuccess?.(data)
}

export function PoolForm() {
  const router = useRouter()
  const [poolTitle, setPoolTitle] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await createPool(
      poolTitle,
      async (data) => {
        await navigator.clipboard.writeText(data.code)
        alert(
          'Bolão criado com sucesso, o código foi copiado para a área de transferência!',
        )
        setPoolTitle('')
        router.refresh()
      },
      (err) => {
        console.error(err)
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex gap-2">
      <input
        value={poolTitle}
        onChange={(e) => setPoolTitle(e.target.value)}
        className="
          border border-gray-600 text-sm focus:outline
          flex-1 px-6 py-4 rounded bg-gray-800 text-gray-100
          focus:outline-ignite-500 focus:outline-1 focus:outline-offset-2
        "
        type="text"
        required
        placeholder="Qual o nome do seu bolão?"
      />

      <button
        className="
          bg-copa-500 px-6 py-4 rounded text-gray-950
          font-bold uppercase text-sm hover:bg-copa-700 transition-colors
          focus:outline-copa-500 focus:outline focus:outline-1 focus:outline-offset-2
        "
        type="submit"
      >
        Criar meu bolão
      </button>
    </form>
  )
}
