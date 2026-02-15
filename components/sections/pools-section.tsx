"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { parseEther } from "viem";
import { useParticipate } from "@/hooks/useCompetitivePot";
import { CoinDropAnimation } from "@/components/coin-drop-animation";
import { AnimatedMoney } from "@/components/animated-number";

interface PoolsSectionProps {
  address: string | null;
  poolData: {
    totalPool: string;
    round: number;
    timeRemainingSeconds: number;
    lastBidder: string;
    lastBidFormatted: string;
    isActive: boolean;
  };
  minimumBidFormatted: string;
  isMinBidLoading: boolean;
}

function formatCountdown(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return {
    hours: Math.floor(s / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function shortAddr(addr: string): string {
  if (!addr || addr === "0x0000000000000000000000000000000000000000" || addr.length < 10) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function PoolsSection({ address, poolData, minimumBidFormatted, isMinBidLoading }: PoolsSectionProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [countdown, setCountdown] = useState(poolData.timeRemainingSeconds);

  // Default bid amount to minimum bid when it loads
  useEffect(() => {
    if (minimumBidFormatted && minimumBidFormatted !== "0" && !bidAmount) {
      setBidAmount(minimumBidFormatted);
    }
  }, [minimumBidFormatted]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setCountdown(poolData.timeRemainingSeconds);
  }, [poolData.timeRemainingSeconds]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const { participate, hash, isPending, isConfirming, isSuccess, error } = useParticipate(poolData.round);
  const [showCoinDrop, setShowCoinDrop] = useState(false);
  const lastBidAmountRef = useRef<string>("");

  const time = useMemo(() => formatCountdown(countdown), [countdown]);

  const minBidNum = parseFloat(minimumBidFormatted || "0");
  const bidNum = parseFloat(bidAmount) || 0;
  const canBid = address && poolData.round > 0 && poolData.isActive && bidNum >= minBidNum && !isPending && !isConfirming;
  const isBusy = isPending || isConfirming;

  const handleParticipate = () => {
    if (!canBid || !bidAmount.trim()) return;
    lastBidAmountRef.current = bidAmount.trim();
    participate(bidAmount.trim());
    setBidAmount(minimumBidFormatted);
  };

  // Trigger coin animation when bid succeeds
  useEffect(() => {
    if (isSuccess) setShowCoinDrop(true);
  }, [isSuccess]);

  // Record bid to MongoDB for live activity feed
  useEffect(() => {
    if (!isSuccess || !hash || !address) return;
    const amount = lastBidAmountRef.current;
    if (!amount) return;
    const wei = parseEther(amount).toString();
    fetch("/api/pot/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        round: poolData.round,
        txHash: hash,
        bidder: address,
        amountWei: wei,
        amountEth: amount,
      }),
    }).catch(() => {});
  }, [isSuccess, hash, address, poolData.round]);

  const lastBidderShort = shortAddr(poolData.lastBidder);

  const potEnded = poolData.round > 0 && countdown <= 0;

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto py-4">
      {/* Timer badge */}
      {poolData.isActive && (
        <div className="absolute top-[-1px] right-1 z-10 sm:top-4 sm:right-4">
          <div className="relative flex flex-col items-center rounded-lg border-2 border-[#2C1810] bg-gradient-to-br from-[#FFD93D] via-[#FFED4E] to-[#FFD93D] p-2 shadow-[3px_3px_0_0_rgba(44,24,16,1)] min-w-[100px] sm:min-w-[140px] sm:rounded-xl sm:border-[3px] sm:p-3 sm:shadow-[4px_4px_0_0_rgba(44,24,16,1)]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FFD93D]/20 to-transparent pointer-events-none" />
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-sm">⏱️</span>
                <p className="text-[10px] font-black text-[#2C1810] uppercase tracking-wider">Ends In</p>
              </div>
              <div className="flex items-baseline justify-center gap-0.5 sm:gap-1">
                {[
                  { val: time.hours, label: "H" },
                  { val: time.minutes, label: "M" },
                  { val: time.seconds, label: "S" },
                ].map((unit, i) => (
                  <div key={unit.label} className="flex items-baseline">
                    {i > 0 && (
                      <span className="text-base font-black text-[#2C1810] leading-none pb-1 mx-0.5 sm:text-xl md:text-2xl">:</span>
                    )}
                    <div className="flex flex-col items-center">
                      <span className="text-base font-black text-[#2C1810] leading-none tabular-nums sm:text-xl md:text-2xl">
                        {String(unit.val).padStart(2, "0")}
                      </span>
                      <span className="text-[7px] font-bold text-[#5D4E37] uppercase mt-0.5">{unit.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="shrink-0 px-2 text-center">
        <h2 className="text-lg font-bold text-[#2C1810] sm:text-xl md:text-2xl">
          <span className="text-primary">{">"}</span> Current Pot
        </h2>
        <p className="mt-1 text-sm font-semibold text-[#5D4E37] sm:mt-2 sm:text-base">
          Round #{poolData.round}
        </p>
      </div>

      {/* Pool total + last bidder */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center mb-4 sm:mb-6">
          <div className="text-5xl font-black text-[#FFD93D] drop-shadow-[2px_2px_0_rgba(44,24,16,0.7)] flex items-baseline justify-center gap-2 sm:text-6xl md:text-7xl lg:text-8xl">
            <AnimatedMoney
              value={poolData.totalPool}
              suffix=" MON"
              fontSize={80}
              color="#FFD93D"
              className="font-black drop-shadow-[2px_2px_0_rgba(44,24,16,0.7)]"
            />
          </div>
          <p className="mt-2 text-lg font-bold text-[#FFD93D] drop-shadow-[1px_1px_0_rgba(44,24,16,0.6)] sm:mt-3 sm:text-xl md:text-2xl">
            Total Pool
          </p>
        </div>

        {potEnded && (
          <div className="mb-4 mx-auto max-w-xs rounded-lg border-2 border-red-400 bg-red-50 p-3 sm:rounded-xl sm:border-[3px]">
            <p className="text-sm font-bold text-red-700 text-center">
              ⏰ This pot has ended!
            </p>
            <p className="text-xs text-red-600 text-center mt-1">
              Check the History tab for results
            </p>
          </div>
        )}

        <div className="relative w-full max-w-[200px] sm:max-w-[280px] md:max-w-[360px]">
          <CoinDropAnimation
            trigger={showCoinDrop}
            onComplete={() => setShowCoinDrop(false)}
          />
          <Image
            src="/images/assets/Money Bag Animated.gif"
            alt="Money Bag"
            width={500}
            height={500}
            className="h-auto w-full drop-shadow-2xl"
            unoptimized
          />
        </div>

        {/* Current Winner – above min bid block so it doesn’t block the coin animation */}
        {lastBidderShort && (
          <div className="mt-4 mx-auto w-full max-w-sm rounded-lg border-2 border-[#FFD93D] bg-[#FFD93D] p-3 sm:rounded-xl sm:border-[3px] sm:p-4">
            <p className="text-sm font-bold text-[#2C1810] sm:text-base text-center">
              🏆 Current Winner: {lastBidderShort}
            </p>
            <p className="text-base font-bold text-[#2C1810]/90 text-center mt-1 flex items-center justify-center gap-1 sm:text-lg">
              <span>Recent bid:</span>
              <AnimatedMoney
                value={poolData.lastBidFormatted}
                suffix=" MON"
                fontSize={18}
                color="rgba(44, 24, 16, 0.9)"
                className="font-bold"
              />
            </p>
          </div>
        )}

        {/* Bid form */}
        {poolData.round > 0 && poolData.isActive && countdown > 0 && (
          <div className="mt-4 w-full max-w-sm rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-4 shadow-[3px_3px_0_0_rgba(44,24,16,1)]">
            <p className="text-center text-base font-bold text-[#2C1810] flex items-center justify-center gap-1 sm:text-lg">
              <span>Min bid:</span>
              {isMinBidLoading ? (
                <span>…</span>
              ) : (
                <AnimatedMoney
                  value={minimumBidFormatted}
                  suffix=" MON"
                  fontSize={18}
                  color="#2C1810"
                  className="font-bold"
                />
              )}
            </p>
            {!address ? (
              <p className="mt-3 text-center text-sm text-[#5D4E37]">Connect wallet to participate</p>
            ) : (
              <>
                <div className="mt-3 flex flex-col gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="MON amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full rounded-lg border-2 border-[#2C1810] bg-white px-3 py-2 text-center font-bold text-[#2C1810]"
                  />
                  <button
                    type="button"
                    disabled={!canBid || isBusy}
                    onClick={handleParticipate}
                    className="w-full rounded-lg border-2 border-[#2C1810] bg-[#FFD93D] py-2.5 font-black text-[#2C1810] shadow-[2px_2px_0_0_rgba(44,24,16,1)] disabled:opacity-50 active:scale-95 transition-transform"
                  >
                    {isBusy ? "Confirm in wallet…" : isSuccess ? "Bid placed!" : "Place Bid"}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-center text-xs text-red-600">{error.message || "Transaction failed"}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
