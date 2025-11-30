'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { useState, useEffect } from 'react'

export function WalletActions() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()

  const shortenAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-center text-white">Quizmania</h1>
        <button
          type="button"
          className="bg-white text-black w-full rounded-lg p-2 text-sm font-medium"
          disabled
        >
          Loading...
        </button>
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-center text-white">Quizmania</h1>
        <div className="border border-[#333] rounded-xl p-3 space-y-2">
          <p className="text-xs text-gray-300 text-center">
            <span className="bg-white text-black font-mono rounded-md px-2 py-1.5">
              {shortenAddress(address)}
            </span>
          </p>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white w-full rounded-lg p-2 text-sm font-medium active:scale-95 transition"
            onClick={() => disconnect()}
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-center text-white">Quizmania</h1>
      <button
        type="button"
        className="bg-white text-black w-full rounded-lg p-2 text-sm font-medium active:scale-95 transition"
        onClick={() => open()}
      >
        Connect Wallet
      </button>
    </div>
  )
}
