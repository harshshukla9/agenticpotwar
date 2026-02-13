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
  // Show up to 6 decimals, trim trailing zeros
  return num.toFixed(6).replace(/\.?0+$/, "") || "0";
}

/* ------------------------------------------------------------------ */
/*  getCurrentPotDetails – single call, all pot info                   */
/* ------------------------------------------------------------------ */
export interface CurrentPotDetails {
  potId: number;
  totalFundsWei: bigint;
  totalFundsFormatted: string;
  endTime: number;
  timeRemainingSeconds: number;
  lastBidAmountWei: bigint;
  lastBidAmountFormatted: string;
  minimumNextBidWei: bigint;
  minimumNextBidFormatted: string;
  lastBidder: string;
  topContributor: string;
  topContributorAmountWei: bigint;
  topContributorAmountFormatted: string;
  participantCount: number;
  isActive: boolean;
  hasEnded: boolean;
}

export function useCurrentPotDetails() {
  const [details, setDetails] = useState<CurrentPotDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetails = useCallback(async () => {
    try {
      const data = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: "getCurrentPotDetails",
      });

      const result = data as readonly [
        bigint, bigint, bigint, bigint, bigint, bigint,
        string, string,
        bigint, bigint,
        boolean, boolean,
      ];

      const [
        potId, totalFunds, endTime, timeRemaining,
        lastBidAmount, minimumNextBid,
        lastBidder, topContributor,
        topContributorAmount, participantCount,
        isActive, hasEnded,
      ] = result;

      setDetails({
        potId: Number(potId),
        totalFundsWei: totalFunds,
        totalFundsFormatted: weiToEth(totalFunds),
        endTime: Number(endTime),
        timeRemainingSeconds: Number(timeRemaining),
        lastBidAmountWei: lastBidAmount,
        lastBidAmountFormatted: weiToEth(lastBidAmount),
        minimumNextBidWei: minimumNextBid,
        minimumNextBidFormatted: weiToEth(minimumNextBid),
        lastBidder,
        topContributor,
        topContributorAmountWei: topContributorAmount,
        topContributorAmountFormatted: weiToEth(topContributorAmount),
        participantCount: Number(participantCount),
        isActive,
        hasEnded,
      });
      setError(null);
    } catch (err) {
      console.error("[useCurrentPotDetails] fetch error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetails();
    const interval = setInterval(fetchDetails, 15_000); // poll every 15s
    return () => clearInterval(interval);
  }, [fetchDetails]);

  return { details, isLoading, error, refetch: fetchDetails };
}

/* ------------------------------------------------------------------ */
/*  getLeaderboard                                                     */
/* ------------------------------------------------------------------ */
export interface LeaderboardEntry {
  address: string;
  amountWei: bigint;
  amountFormatted: string;
}

export function useLeaderboard(potId: number) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    if (potId <= 0) {
      setLeaderboard([]);
      setParticipantCount(0);
      setIsLoading(false);
      return;
    }
    try {
      const data = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: "getLeaderboard",
        args: [BigInt(potId)],
      });

      const [users, amounts] = data as readonly [readonly string[], readonly bigint[]];

      const entries: LeaderboardEntry[] = users.map((addr, i) => ({
        address: addr,
        amountWei: amounts[i] ?? BigInt(0),
        amountFormatted: weiToEth(amounts[i] ?? BigInt(0)),
      }));

      setLeaderboard(entries);
      setParticipantCount(users.length);
      setError(null);
    } catch (err) {
      console.error("[useLeaderboard] fetch error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [potId]);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 20_000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return { leaderboard, participantCount, isLoading, error, refetch: fetchLeaderboard };
}

/* ------------------------------------------------------------------ */
/*  participate (write – still uses wagmi for wallet signing)          */
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
