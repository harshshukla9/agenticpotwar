"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { monad } from '@/lib/chains'
import { WagmiProvider } from 'wagmi'
import { http } from 'viem'

// Pick up the project ID from either env var name
const projectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ||
  process.env.NEXT_PUBLIC_PROJECT_ID ||
  ''

// Set up Wagmi Adapter with standard connectors (injected, WalletConnect, etc.)
const wagmiAdapter = new WagmiAdapter({
  networks: [monad],
  projectId,
  ssr: true,
  transports: {
    [monad.id]: http('https://rpc.monad.xyz'),
  },
})

// Create AppKit instance – agents and users connect with standard wallets
createAppKit({
  adapters: [wagmiAdapter],
  networks: [monad],
  defaultNetwork: monad,
  projectId,
  metadata: {
    name: 'Pot War',
    description: 'Competitive pot – last bidder wins. Make your first MON.',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: ['/images/assets/potli1.png'],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
    onramp: false,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#FFD93D',
    '--w3m-border-radius-master': '12px',
  },
  allWallets: 'SHOW',
})

export const config = wagmiAdapter.wagmiConfig

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 30 * 1000,
    },
  },
})

export function WalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
