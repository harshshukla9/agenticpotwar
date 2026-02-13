"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParticipate } from "@/hooks/useCompetitivePot";
import { ShareToFarcaster, useShareToFarcaster } from "@/components/share-to-farcaster";

interface PoolsSectionProps {
  address: string | null;
  poolData: {
    totalPool: string;
    round: number;
    totalDeposits: number;
    timeRemainingSeconds: number;
    lastBidder: string;
    lastBidFormatted: string;
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

function formatTimeForShare(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function PoolsSection({ address, poolData, minimumBidFormatted, isMinBidLoading }: PoolsSectionProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [countdown, setCountdown] = useState(poolData.timeRemainingSeconds);
  const [lastBidAmountForShare, setLastBidAmountForShare] = useState<string | null>(null);

  useEffect(() => {
    setCountdown(poolData.timeRemainingSeconds);
  }, [poolData.timeRemainingSeconds]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const { participate, isPending, isConfirming, isSuccess, error } = useParticipate(poolData.round);
  const { share: shareToFarcaster } = useShareToFarcaster();
  const hasAutoShared = useRef(false);

  const time = useMemo(() => formatCountdown(countdown), [countdown]);

  const minBidNum = parseFloat(minimumBidFormatted || "0");
  const bidNum = parseFloat(bidAmount) || 0;
  const canBid = address && poolData.round > 0 && bidNum >= minBidNum && !isPending && !isConfirming;
  const isBusy = isPending || isConfirming;

  const handleParticipate = () => {
    if (!canBid || !bidAmount.trim()) return;
    const amount = bidAmount.trim();
    setLastBidAmountForShare(amount);
    participate(amount);
    setBidAmount("");
  };

  const lastBidderShort = shortAddr(poolData.lastBidder);

  const poolShareData = {
    round: poolData.round,
    totalPool: poolData.totalPool,
    participantCount: poolData.totalDeposits,
    timeRemainingFormatted: formatTimeForShare(countdown),
    minBid: minimumBidFormatted,
    lastBidderShort: lastBidderShort || undefined,
    lastBidFormatted: poolData.lastBidFormatted || undefined,
  };

  // Auto-trigger share to Farcaster when bid is placed successfully (once per success)
  useEffect(() => {
    if (!isSuccess || !lastBidAmountForShare || poolData.round <= 0 || hasAutoShared.current) return;
    hasAutoShared.current = true;
    shareToFarcaster("bid_placed", {
      round: poolData.round,
      totalPool: poolData.totalPool,
      participantCount: poolData.totalDeposits,
      timeRemainingFormatted: formatTimeForShare(countdown),
      minBid: minimumBidFormatted,
      lastBidderShort: lastBidderShort || undefined,
      lastBidFormatted: poolData.lastBidFormatted || undefined,
      myBidAmount: lastBidAmountForShare,
    });
  }, [isSuccess, lastBidAmountForShare, poolData.round, poolData.totalPool, poolData.totalDeposits, poolData.lastBidFormatted, minimumBidFormatted, countdown, lastBidderShort, shareToFarcaster]);

  useEffect(() => {
    if (!isSuccess) hasAutoShared.current = false;
  }, [isSuccess]);

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto py-4">
      {/* Timer badge */}
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
          <div className="text-3xl font-black text-[#FFD93D] drop-shadow-[2px_2px_0_rgba(44,24,16,0.7)] flex items-baseline justify-center gap-1 sm:text-4xl md:text-5xl lg:text-6xl">
            <span>{poolData.totalPool}</span>
            <span className="text-xl sm:text-2xl md:text-3xl">ETH</span>
          </div>
          <p className="mt-1 text-base font-bold text-[#FFD93D] drop-shadow-[1px_1px_0_rgba(44,24,16,0.6)] sm:mt-2 sm:text-lg md:text-xl">
            Total Pool
          </p>
          <p className="mt-1 text-sm font-semibold text-[#5D4E37]">{poolData.totalDeposits} participant{poolData.totalDeposits !== 1 ? "s" : ""}</p>
        </div>

        {lastBidderShort && (
          <div className="mb-4 mx-auto max-w-xs rounded-lg border-2 border-[#FFD93D] bg-[#FFD93D] p-2 sm:rounded-xl sm:border-[3px] sm:p-3">
            <p className="text-xs font-bold text-[#2C1810] sm:text-sm text-center">
              🏆 Current Winner: {lastBidderShort}
              <span className="ml-1">({poolData.lastBidFormatted} ETH)</span>
            </p>
          </div>
        )}

        <div className="relative w-full max-w-[200px] sm:max-w-[280px] md:max-w-[360px]">
          <Image
            src="/images/assets/Money Bag Animated.gif"
            alt="Money Bag"
            width={500}
            height={500}
            className="h-auto w-full drop-shadow-2xl"
            unoptimized
          />
        </div>

        {/* Bid form */}
        {poolData.round > 0 && countdown > 0 && (
          <div className="mt-6 w-full max-w-sm rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-4 shadow-[3px_3px_0_0_rgba(44,24,16,1)]">
            <p className="text-center text-sm font-bold text-[#2C1810]">
              Min bid: {isMinBidLoading ? "…" : `${minimumBidFormatted} ETH`}
            </p>
            {!address ? (
              <p className="mt-3 text-center text-sm text-[#5D4E37]">Connect wallet to participate</p>
            ) : (
              <>
                <div className="mt-3 flex flex-col gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="ETH amount"
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
                  <ShareToFarcaster
                    type="pool"
                    data={poolShareData}
                    variant="button"
                    size="md"
                    className="w-full min-h-[44px] touch-manipulation mt-2"
                  />
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
