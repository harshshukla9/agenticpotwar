"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden bg-gradient-to-b from-[#fefcf4] via-[#FFD93D] to-[#fefcf4] px-4 py-6 safe-area-padding sm:px-6">
      {/* Background decorative images - reduced on mobile */}
      <div className="absolute top-4 left-4 z-0 opacity-15 sm:top-10 sm:left-10 sm:opacity-20">
        <Image src="/images/assets/potli1.png" alt="" width={80} height={80} className="drop-shadow-lg sm:w-[150px] sm:h-[150px]" />
      </div>
      <div className="absolute top-6 right-4 z-0 opacity-15 sm:top-20 sm:right-20 sm:opacity-20">
        <Image src="/images/assets/potli1.png" alt="" width={60} height={60} className="drop-shadow-lg sm:w-[120px] sm:h-[120px]" />
      </div>
      <div className="absolute bottom-24 left-4 z-0 opacity-15 sm:bottom-20 sm:left-20 sm:opacity-20">
        <Image src="/images/assets/potli1.png" alt="" width={100} height={100} className="drop-shadow-lg sm:w-[180px] sm:h-[180px]" />
      </div>
      <div className="absolute bottom-6 right-4 z-0 opacity-15 sm:bottom-10 sm:right-10 sm:opacity-20">
        <Image src="/images/assets/potli1.png" alt="" width={70} height={70} className="drop-shadow-lg sm:w-[140px] sm:h-[140px]" />
      </div>

      {/* Monad decorative - fewer on mobile, hidden on very small */}
      <div className="absolute top-1/3 right-1/6 z-0 hidden opacity-40 sm:block sm:opacity-50">
        <Image src="/images/assets/Monad image.png" alt="" width={40} height={40} className="drop-shadow-lg sm:w-[60px] sm:h-[60px]" />
      </div>
      <div className="absolute bottom-1/3 left-1/6 z-0 hidden opacity-40 sm:block sm:opacity-50">
        <Image src="/images/assets/Monad image.png" alt="" width={45} height={45} className="drop-shadow-lg sm:w-[70px] sm:h-[70px]" />
      </div>

      {/* Hero - single column, mobile first */}
      <section className="relative z-10 w-full max-w-lg flex-1 flex flex-col items-center justify-center text-center sm:max-w-2xl">
        <div className="relative mb-4 sm:mb-6">
          <Image
            src="/images/assets/potli1.png"
            alt="Money Bag"
            width={280}
            height={280}
            className="h-auto w-full max-w-[200px] drop-shadow-2xl sm:max-w-[320px]"
            priority
          />
        </div>
        <div className="mb-2 flex justify-center sm:mb-4">
          <Image src="/images/assets/potli1.png" alt="" width={56} height={56} className="drop-shadow-lg sm:w-[80px] sm:h-[80px]" />
        </div>
        <h1 className="mb-4 text-3xl font-black leading-tight text-[#2C1810] drop-shadow-[2px_2px_0_rgba(0,0,0,0.15)] sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
          Make Your First{" "}
          <span className="text-[#9333EA] drop-shadow-[2px_2px_0_rgba(44,24,16,0.25)]">ARB</span>
        </h1>
        <p className="mb-6 max-w-md text-base font-bold leading-snug text-[#5D4E37] sm:mb-8 sm:text-lg md:text-xl">
          The last bidder wins 80% of the pot. Bid in ARB on Arbitrum.
        </p>
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="min-h-[48px] w-full min-w-[140px] touch-manipulation cursor-pointer rounded-xl border-4 border-[#2C1810] bg-[#FFD93D] px-6 py-4 text-base font-black text-[#2C1810] shadow-[6px_6px_0_0_rgba(44,24,16,1)] transition-transform active:scale-[0.98] active:shadow-[3px_3px_0_0_rgba(44,24,16,1)] sm:min-h-[52px] sm:py-4 sm:text-lg"
          >
            Start Playing Now
          </button>
          <div className="relative">
            <Image src="/images/assets/potli1.png" alt="" width={48} height={48} className="drop-shadow-lg sm:w-[60px] sm:h-[60px]" />
          </div>
        </div>
      </section>
    </main>
  );
}
