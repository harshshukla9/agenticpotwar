import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Pot War | Make Your First ARB',
  description: 'The last depositor wins the entire pool. Strategy, timing, and a bit of luck!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.className} min-h-[100dvh] bg-[#fefcf4] text-[#2C1810] antialiased [-webkit-tap-highlight-color:transparent]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
