import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Daily Dashboard',
  description: 'Minimalistic Apple-style daily task dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sf antialiased">{children}</body>
    </html>
  )
}
