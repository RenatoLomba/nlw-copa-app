async function getPoolsCount(): Promise<{ count: number }> {
  const res = await fetch('http://localhost:3333/pools/count', {
    cache: 'no-store',
  })

  return res.json()
}

export default async function Home() {
  const { count } = await getPoolsCount()

  return (
    <div>
      <h1>Pools Count</h1>

      <span>{count}</span>
    </div>
  )
}
