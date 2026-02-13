'use client'

import { LandingPage } from '@/components/landing'
import { useFrame } from '@/components/farcaster-provider'
import { SafeAreaContainer } from '@/components/safe-area-container'

export default function Home() {
  const { context, isLoading, isSDKLoaded } = useFrame()

  if (isLoading) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#fefcf4] p-4 space-y-8">
          <h1 className="text-center text-3xl font-bold text-[#2C1810]">Loading...</h1>
        </div>
      </SafeAreaContainer>
    )
  }

  if (!isSDKLoaded) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#fefcf4] p-4 space-y-8">
          <h1 className="text-center text-3xl font-bold text-[#2C1810]">
            No Farcaster SDK found. Open this miniapp inside the Farcaster app.
          </h1>
        </div>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <LandingPage />
    </SafeAreaContainer>
  )
}
