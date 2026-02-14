'use client'

import { WalletActions } from '@/components/Home/WalletActions'

export function Demo() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Pot War</h1>
      <div className="w-full max-w-4xl space-y-6">
        <WalletActions />
      </div>
    </div>
  )
}
