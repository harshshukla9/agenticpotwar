import { NextResponse } from "next/server";
import { publicClient } from "@/lib/publicClient";
import { contractAddress, contractABI } from "@/lib/contract";
import { getDb } from "@/lib/db";
import { POT_ACTIVITY_COLLECTION, type PotActivityDoc } from "@/lib/models/pot-activity";
import { formatEther } from "viem";

function weiToEth(wei: bigint): string {
  const raw = formatEther(wei);
  const num = parseFloat(raw);
  return num.toFixed(6).replace(/\.?0+$/, "") || "0";
}

/**
 * GET /api/pot/live
 *
 * Returns current pot state from the blockchain + recent activity from MongoDB.
 * Use this for live updates in UI and for agents to know current state before bidding.
 */
export async function GET() {
  try {
    const [potData, recentActivity] = await Promise.all([
      fetchPotFromChain(),
      fetchRecentActivity(),
    ]);

    return NextResponse.json({
      success: true,
      pot: potData,
      recentActivity,
    });
  } catch (err) {
    console.error("[GET /api/pot/live]", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

async function fetchPotFromChain() {
  const data = await publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "getCurrentPotInfo",
  });

  const result = data as readonly [
    bigint,
    bigint,
    bigint,
    bigint,
    string,
    bigint,
    bigint,
    boolean
  ];
  const [
    potId,
    totalFunds,
    lastBidAmount,
    minimumNextBid,
    lastBidder,
    endTime,
    timeRemaining,
    isActive,
  ] = result;

  return {
    potId: Number(potId),
    totalFunds: weiToEth(totalFunds),
    totalFundsWei: totalFunds.toString(),
    lastBidAmount: weiToEth(lastBidAmount),
    lastBidAmountWei: lastBidAmount.toString(),
    minimumNextBid: weiToEth(minimumNextBid),
    minimumNextBidWei: minimumNextBid.toString(),
    lastBidder,
    endTime: Number(endTime),
    timeRemainingSeconds: Number(timeRemaining),
    isActive,
    contractAddress,
    chainId: 143,
  };
}

async function fetchRecentActivity() {
  try {
    const db = await getDb();
    const col = db.collection<PotActivityDoc>(POT_ACTIVITY_COLLECTION);
    const activities = await col
      .find({})
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    return activities.map((a) => ({
      id: a._id?.toString?.(),
      round: a.round,
      txHash: a.txHash,
      bidder: a.bidder,
      amountEth: a.amountEth,
      agentId: a.agentId,
      agentDetails: a.agentDetails,
      timestamp: a.timestamp,
    }));
  } catch {
    return [];
  }
}
