"use client";

import { useState, useEffect, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { contractAddress, contractABI } from "@/lib/contract";
import { publicClient } from "@/lib/publicClient";

/* ------------------------------------------------------------------ */
/*  Helper: format wei → ETH string with up to 6 decimal places       */
/* ------------------------------------------------------------------ */
function weiToEth(wei: bigint): string {
  const raw = formatEther(wei);
  const num = parseFloat(raw);
  return num.toFixed(6).replace(/\.?0+$/, "") || "0";
}

/* ------------------------------------------------------------------ */
/*  getCurrentPotInfo – single call, all current pot info              */
/* ------------------------------------------------------------------ */
export interface CurrentPotInfo {
  potId: number;
  totalFundsWei: bigint;
  totalFundsFormatted: string;
  lastBidAmountWei: bigint;
  lastBidAmountFormatted: string;
  minimumNextBidWei: bigint;
  minimumNextBidFormatted: string;
  lastBidder: string;
  endTime: number;
  timeRemainingSeconds: number;
  isActive: boolean;
}

export function useCurrentPotInfo() {
  const [details, setDetails] = useState<CurrentPotInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetails = useCallback(async () => {
    try {
      const data = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: "getCurrentPotInfo",
      });

      // Return order: potId, totalFunds, lastBidAmount, minimumNextBid, lastBidder, endTime, timeRemaining, isActive
      const result = data as readonly [
        bigint, bigint, bigint, bigint,
        string,
        bigint, bigint,
        boolean,
      ];

      const [
        potId, totalFunds, lastBidAmount, minimumNextBid,
        lastBidder,
        endTime, timeRemaining,
        isActive,
      ] = result;

      setDetails({
        potId: Number(potId),
        totalFundsWei: totalFunds,
        totalFundsFormatted: weiToEth(totalFunds),
        lastBidAmountWei: lastBidAmount,
        lastBidAmountFormatted: weiToEth(lastBidAmount),
        minimumNextBidWei: minimumNextBid,
        minimumNextBidFormatted: weiToEth(minimumNextBid),
        lastBidder,
        endTime: Number(endTime),
        timeRemainingSeconds: Number(timeRemaining),
        isActive,
      });
      setError(null);
    } catch (err) {
      console.error("[useCurrentPotInfo] fetch error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetails();
    const interval = setInterval(fetchDetails, 15_000);
    return () => clearInterval(interval);
  }, [fetchDetails]);

  return { details, isLoading, error, refetch: fetchDetails };
}

/* ------------------------------------------------------------------ */
/*  getPotHistory – view past pot results                              */
/* ------------------------------------------------------------------ */
export interface PotHistoryEntry {
  potId: number;
  startTime: number;
  endTime: number;
  winner: string;
  finalAmountWei: bigint;
  finalAmountFormatted: string;
}

export function usePotHistory(currentPotId: number) {
  const [history, setHistory] = useState<PotHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = useCallback(async () => {
    if (currentPotId <= 0) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    try {
      const entries: PotHistoryEntry[] = [];

      // Fetch all past (ended) pots. Current pot may still be active, include it too.
      for (let i = 1; i <= currentPotId; i++) {
        try {
          const data = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: contractABI,
            functionName: "getPotHistory",
            args: [BigInt(i)],
          });

          const result = data as readonly [bigint, bigint, string, bigint];
          const [startTime, endTime, winner, finalAmount] = result;

          // Only include pots that have ended (finalAmount > 0 or endTime in the past)
          if (Number(finalAmount) > 0 || (Number(endTime) > 0 && Number(endTime) < Date.now() / 1000)) {
            entries.push({
              potId: i,
              startTime: Number(startTime),
              endTime: Number(endTime),
              winner,
              finalAmountWei: finalAmount,
              finalAmountFormatted: weiToEth(finalAmount),
            });
          }
        } catch {
          // Skip pots that error (shouldn't happen with valid IDs)
        }
      }

      setHistory(entries.reverse()); // newest first
      setError(null);
    } catch (err) {
      console.error("[usePotHistory] fetch error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [currentPotId]);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 30_000);
    return () => clearInterval(interval);
  }, [fetchHistory]);

  return { history, isLoading, error, refetch: fetchHistory };
}

/* ------------------------------------------------------------------ */
/*  pendingWithdrawals – check claimable amount for a user             */
/* ------------------------------------------------------------------ */
export function usePendingWithdrawals(address: string | undefined) {
  const [amount, setAmount] = useState<bigint>(BigInt(0));
  const [formatted, setFormatted] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPending = useCallback(async () => {
    if (!address) {
      setAmount(BigInt(0));
      setFormatted("0");
      setIsLoading(false);
      return;
    }

    try {
      const data = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: "pendingWithdrawals",
        args: [address as `0x${string}`],
      });

      const wei = data as bigint;
      setAmount(wei);
      setFormatted(weiToEth(wei));
    } catch (err) {
      console.error("[usePendingWithdrawals] error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 15_000);
    return () => clearInterval(interval);
  }, [fetchPending]);

  return { amount, formatted, isLoading, refetch: fetchPending };
}

/* ------------------------------------------------------------------ */
/*  withdraw – claim pending winnings                                  */
/* ------------------------------------------------------------------ */
export function useWithdraw() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const withdraw = () => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: "withdraw",
    });
  };

  return { withdraw, hash, isPending, isConfirming, isSuccess, error };
}

/* ------------------------------------------------------------------ */
/*  participate (write – uses wagmi for wallet signing)                */
/* ------------------------------------------------------------------ */
export function useParticipate(potId: number) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const participate = (valueInEth: string) => {
    if (potId <= 0) return;
    const wei = parseEther(valueInEth);
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: "participate",
      args: [BigInt(potId)],
      value: wei,
    });
  };

  return { participate, hash, isPending, isConfirming, isSuccess, error };
}
