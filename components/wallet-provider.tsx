"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { arbitrum, base } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'
import { http } from 'viem'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'

// Pick up the project ID from either env var name
const projectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ||
  process.env.NEXT_PUBLIC_PROJECT_ID ||
  ''

// Set up Wagmi Adapter with Farcaster connector + public Arbitrum RPC fallback
const wagmiAdapter = new WagmiAdapter({
  networks: [arbitrum, base],
  projectId,
  ssr: true,
  transports: {
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [base.id]: http('https://mainnet.base.org'),
  },
  connectors: [
    miniAppConnector(),
  ],
})

// Create AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks: [arbitrum, base],
  defaultNetwork: arbitrum,
  projectId,
  metadata: {
    name: 'Pot War',
    description: 'Competitive pot – last bidder wins. Make your first ARB.',
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

// Export the wagmi config
// This includes:
// - Farcaster Mini App connector (for in-app usage)
// - All wallets supported by Reown AppKit (MetaMask, Coinbase, etc.)
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
