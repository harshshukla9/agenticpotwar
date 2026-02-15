"use client";

import { Coins, Trophy, TrendingUp, Wallet } from "lucide-react";
import { useWithdraw } from "@/hooks/useCompetitivePot";
import { AnimatedMoney } from "@/components/animated-number";

interface ProfileSectionProps {
  address: string | null;
  poolData: {
    totalPool: string;
  };
  pendingWithdrawal: string;
  pendingAmount: bigint;
  refetchPending: () => void;
  copied: boolean;
  copyToClipboard: (text: string) => void;
}

export function ProfileSection({
  address,
  poolData,
  pendingWithdrawal,
  pendingAmount,
  refetchPending,
  copied,
  copyToClipboard,
}: ProfileSectionProps) {
  const { withdraw, isPending, isConfirming, isSuccess, error } = useWithdraw();
  const hasPending = pendingAmount > BigInt(0);
  const isBusy = isPending || isConfirming;

  const handleWithdraw = () => {
    withdraw();
  };

  // Refetch pending after successful withdrawal
  if (isSuccess && hasPending) {
    setTimeout(() => refetchPending(), 3000);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto py-2 sm:space-y-6">
      <div className="shrink-0">
        <h2 className="text-lg font-bold text-[#2C1810] sm:text-xl md:text-2xl">
          <span className="text-primary">{">"}</span> Your Profile
        </h2>
        <p className="mt-1 text-sm font-semibold text-[#5D4E37] sm:mt-2 sm:text-base">
          Your address and winnings
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

      {/* Withdraw section */}
      {address && (
        <div className={`rounded-2xl border-4 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
          hasPending
            ? "border-[#2C1810] bg-gradient-to-br from-[#FFD93D] via-[#FFED4E] to-[#FFD93D]"
            : "border-[#2C1810] bg-[#fefcf4]"
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-bold uppercase text-[#2C1810]">Pending Winnings</p>
              <p className="mt-3 text-4xl font-black text-[#2C1810] sm:text-5xl">
                <AnimatedMoney
                  value={pendingWithdrawal}
                  suffix=" MON"
                  fontSize={40}
                  color="#2C1810"
                  className="font-black"
                />
              </p>
              <p className="mt-2 text-sm font-semibold text-[#5D4E37]">
                {hasPending ? "Available to claim" : "No pending winnings"}
              </p>
              {hasPending && (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={handleWithdraw}
                  className="mt-4 w-full max-w-[200px] rounded-lg border-2 border-[#2C1810] bg-[#2C1810] py-2.5 font-black text-[#FFD93D] shadow-[2px_2px_0_0_rgba(44,24,16,0.5)] disabled:opacity-50 active:scale-95 transition-transform"
                >
                  {isBusy ? "Confirming…" : isSuccess ? "Withdrawn!" : "Withdraw MON"}
                </button>
              )}
              {error && (
                <p className="mt-2 text-xs text-red-600">{error.message || "Withdraw failed"}</p>
              )}
              {isSuccess && (
                <p className="mt-2 text-xs font-bold text-green-700">Successfully withdrawn!</p>
              )}
            </div>
            <div className="rounded-full border-3 border-[#2C1810] bg-white p-2">
              <Wallet className="h-6 w-6 text-[#2C1810]" strokeWidth={3} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-4 border-[#2C1810] bg-[#fefcf4] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-[#5D4E37] uppercase">Pool total</p>
              <p className="mt-3 text-3xl font-black text-[#2C1810] sm:text-4xl">
                <AnimatedMoney
                  value={poolData.totalPool}
                  suffix=" MON"
                  fontSize={36}
                  color="#2C1810"
                  className="font-black"
                />
              </p>
              <p className="mt-2 text-sm font-semibold text-[#5D4E37]">Current pot</p>
            </div>
            <div className="rounded-full border-3 border-[#2C1810] bg-[#FFD93D] p-2">
              <Coins className="h-6 w-6 text-[#2C1810]" strokeWidth={3} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border-4 border-[#2C1810] bg-[#FFD93D] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#2C1810] uppercase">Payouts</p>
              <p className="mt-3 text-lg font-black text-[#2C1810]">80% to winner</p>
              <p className="mt-1 text-xs font-semibold text-[#2C1810]">Last bidder takes it all</p>
            </div>
            <div className="rounded-full border-3 border-[#2C1810] bg-white p-2">
              <Trophy className="h-6 w-6 text-[#2C1810]" strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
