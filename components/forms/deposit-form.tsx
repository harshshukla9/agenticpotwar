"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export interface DepositFormProps {
  depositAmount: number;
  setDepositAmount: (amount: number) => void;
  isInline?: boolean;
  address: string | null;
  onDeposit?: (deposit: {
    id: string;
    amount: string;
    date: string;
    timestamp: number;
    playerAddress: string;
  }) => void;
}

export function DepositForm({
  depositAmount,
  setDepositAmount,
  isInline = false,
  address,
  onDeposit,
}: DepositFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDepositToPool = async () => {
    if (isLoading || depositAmount <= 0) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const depositId = `#${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const now = new Date();
      const date = now.toISOString().split("T")[0] ?? "";
      const timestamp = now.getTime();
      const newDeposit = {
        id: depositId,
        amount: `$${depositAmount.toFixed(2)}`,
        date,
        timestamp,
        playerAddress: address || `Player${Math.random().toString(36).substring(2, 7)}`,
      };
      onDeposit?.(newDeposit);
      setDepositAmount(0);
    } catch (error) {
      console.error("Error depositing to pool:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${isInline ? "" : "py-4"}`}>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold text-[#5D4E37] uppercase">Deposit Amount (USD)</label>
          <Input
            type="number"
            min="0.01"
            step="0.01"
            value={depositAmount || ""}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
            placeholder="Enter amount"
            className="min-h-[44px] border-2 border-[#2C1810] bg-white text-base font-bold sm:h-12 sm:text-lg"
          />
        </div>
        <div className="rounded-xl border-4 border-[#2C1810] bg-[#FFD93D] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="mb-2 text-sm font-bold text-[#2C1810] uppercase">You Will Deposit</p>
          <p className="text-4xl font-black text-[#2C1810]">${depositAmount.toFixed(2)} USD</p>
        </div>
      </div>
      <div className="w-full rounded-xl border-4 border-black bg-[#fefcf4] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h4 className="mb-5 text-lg font-black text-[#2C1810] uppercase">How It Works</h4>
        <ul className="w-full space-y-4">
          {[
            "Deposit any amount into the pool",
            "The last player to deposit wins ALL funds",
            "Multiple deposits allowed - be the last one!",
            "Pool ends when timer reaches zero",
          ].map((text) => (
            <li
              key={text}
              className="flex w-full items-start gap-4 rounded-lg border-2 border-[#2C1810]/20 bg-white p-4 transition-all hover:border-[#2C1810]/40 hover:bg-[#FFD93D]/10"
            >
              <span className="text-primary shrink-0 text-xl font-black">{">"}</span>
              <span className="flex-1 text-base font-semibold text-[#5D4E37] leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        onClick={onDepositToPool}
        className="bg-primary text-primary-foreground min-h-[48px] w-full touch-manipulation border-2 border-[#2C1810] text-base font-black uppercase shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:border-4 sm:text-lg sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
        disabled={depositAmount <= 0 || isLoading}
      >
        {isLoading ? (
          <span className="text-primary-foreground flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
            DEPOSITING...
          </span>
        ) : (
          <span className="text-primary-foreground">{">"} DEPOSIT TO POOL</span>
        )}
      </Button>
    </div>
  );
}
