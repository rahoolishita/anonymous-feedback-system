import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Feedback App',
  description: 'Created by me',
  generator: 'my-self',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
