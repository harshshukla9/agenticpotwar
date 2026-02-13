"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShareToFarcaster } from "@/components/share-to-farcaster";
import type { LeaderboardEntry } from "@/hooks/useCompetitivePot";

interface LeaderboardSectionProps {
  address: string | null;
  leaderboard: LeaderboardEntry[];
  participantCount: number;
  round?: number;
  totalPoolFormatted?: string;
}

function shortAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function LeaderboardSection({ address, leaderboard, participantCount, round = 0, totalPoolFormatted = "0" }: LeaderboardSectionProps) {
  const myEntry = address ? leaderboard.find((e) => e.address.toLowerCase() === address.toLowerCase()) : null;
  const myRank = myEntry ? leaderboard.indexOf(myEntry) + 1 : 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto py-2 sm:space-y-6">
      <div className="shrink-0">
        <h2 className="text-lg font-bold text-[#2C1810] sm:text-xl md:text-2xl">
          <span className="text-primary">{">"}</span> Leaderboard
        </h2>
        <p className="mt-1 text-sm font-semibold text-[#5D4E37] sm:mt-2 sm:text-base">
          Top contributors by total ETH this round
        </p>
        {myEntry && round > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#5D4E37]">Share your rank to feed:</span>
            <ShareToFarcaster
              type="leading"
              data={{
                round,
                totalPool: totalPoolFormatted,
                participantCount,
                myContribution: myEntry.amountFormatted,
                rank: myRank,
              }}
              variant="button"
              size="md"
            />
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="overflow-hidden rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="max-h-[50vh] overflow-auto overflow-x-auto p-3 sm:max-h-[600px] sm:p-4 md:p-6">
            <Table className="min-w-[320px]">
              <TableHeader>
                <TableRow className="border-b-2 border-[#2C1810] hover:bg-transparent">
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase w-16">Rank</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase">Player</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase text-right">Total ETH</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center font-semibold text-[#5D4E37] py-8">
                      No participants yet
                    </TableCell>
                  </TableRow>
                ) : (
                  leaderboard.map((player, index) => {
                    const rank = index + 1;
                    const isCurrentUser = address ? player.address.toLowerCase() === address.toLowerCase() : false;
                    return (
                      <TableRow
                        key={`${player.address}-${rank}`}
                        className={`border-b border-[#2C1810]/20 transition-colors hover:bg-[#FFD93D]/20 ${rank <= 3 ? "bg-[#FFD93D]/30" : ""} ${isCurrentUser ? "ring-2 ring-[#2C1810]" : ""}`}
                      >
                        <TableCell className="font-black text-[#2C1810]">
                          <div className="flex items-center gap-2">
                            {rank === 1 && <span className="text-2xl">🥇</span>}
                            {rank === 2 && <span className="text-2xl">🥈</span>}
                            {rank === 3 && <span className="text-2xl">🥉</span>}
                            {rank > 3 && <span className="text-lg">#{rank}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono font-bold text-[#2C1810]">
                          {shortAddress(player.address)}
                          {isCurrentUser && (
                            <Badge className="ml-2 bg-[#2C1810] text-[#FFD93D] border border-[#2C1810] text-[10px]">You</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-[#FFD93D] text-[#2C1810] border-2 border-[#2C1810] font-black">
                            {player.amountFormatted} ETH
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-xs font-bold text-[#5D4E37] uppercase">Total players</p>
            <p className="mt-2 text-3xl font-black text-[#2C1810]">{participantCount}</p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#FFD93D] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-xs font-bold text-[#2C1810] uppercase">Top contributor</p>
            <p className="mt-2 font-mono text-lg font-black text-[#2C1810]">
              {leaderboard[0] ? shortAddress(leaderboard[0].address) : "—"}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#2C1810]">
              {leaderboard[0] ? `${leaderboard[0].amountFormatted} ETH` : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
