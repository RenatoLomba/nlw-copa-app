import type { ReactNode } from 'react'

import { Roboto } from '@next/font/google'

import './global.css'

const roboto = Roboto({
  weight: ['400', '500', '700'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <head>
        <title>NLW Copa</title>
        <meta name="description" content="NLW Copa Bolões" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-900 bg-app bg-cover bg-no-repeat">
        {children}
      </body>
    </html>
  )
}
