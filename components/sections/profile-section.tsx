"use client";

import { Coins, Trophy, TrendingUp } from "lucide-react";
import type { LeaderboardEntry } from "@/hooks/useCompetitivePot";

interface ProfileSectionProps {
  address: string | null;
  poolData: {
    userDeposits: number;
    userTotalDeposited: number;
    totalPool: string;
  };
  leaderboard: LeaderboardEntry[];
  copied: boolean;
  copyToClipboard: (text: string) => void;
}

export function ProfileSection({
  address,
  poolData,
  leaderboard,
  copied,
  copyToClipboard,
}: ProfileSectionProps) {
  const userEntry = address
    ? leaderboard.find((e) => e.address.toLowerCase() === address.toLowerCase())
    : null;
  const userContributed = userEntry ? userEntry.amountFormatted : "0";

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto py-2 sm:space-y-6">
      <div className="shrink-0">
        <h2 className="text-lg font-bold text-[#2C1810] sm:text-xl md:text-2xl">
          <span className="text-primary">{">"}</span> Your Profile
        </h2>
        <p className="mt-1 text-sm font-semibold text-[#5D4E37] sm:mt-2 sm:text-base">
          Your address and contribution this round
        </p>
      </div>

      {address && (
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-5">
          <p className="text-xs font-bold text-[#5D4E37] uppercase">Connected address</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-[#2C1810] break-all">{address}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(address)}
              className="shrink-0 rounded border-2 border-[#2C1810] bg-[#FFD93D] px-2 py-1 text-xs font-bold text-[#2C1810]"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {!address && (
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-6 text-center">
          <p className="text-[#5D4E37] font-semibold">Connect your wallet to see your profile</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-4 border-[#2C1810] bg-[#fefcf4] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#5D4E37] uppercase">Your contribution</p>
              <p className="mt-3 text-2xl font-black text-[#2C1810]">{userContributed} ETH</p>
              <p className="mt-1 text-xs font-semibold text-[#5D4E37]">This round</p>
            </div>
            <div className="rounded-full border-3 border-[#2C1810] bg-[#FFD93D] p-2">
              <Coins className="h-6 w-6 text-[#2C1810]" strokeWidth={3} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border-4 border-[#2C1810] bg-[#FFD93D] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#2C1810] uppercase">Participated</p>
              <p className="mt-3 text-3xl font-black text-[#2C1810]">{userEntry ? "Yes" : "No"}</p>
              <p className="mt-1 text-xs font-semibold text-[#2C1810]">In current pot</p>
            </div>
            <div className="rounded-full border-3 border-[#2C1810] bg-white p-2">
              <Trophy className="h-6 w-6 text-[#2C1810]" strokeWidth={3} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border-4 border-[#2C1810] bg-[#fefcf4] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#5D4E37] uppercase">Pool total</p>
              <p className="mt-3 text-2xl font-black text-[#2C1810]">{poolData.totalPool} ETH</p>
              <p className="mt-1 text-xs font-semibold text-[#5D4E37]">Current pot</p>
            </div>
            <div className="rounded-full border-3 border-[#2C1810] bg-[#FFD93D] p-2">
              <TrendingUp className="h-6 w-6 text-[#2C1810]" strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
