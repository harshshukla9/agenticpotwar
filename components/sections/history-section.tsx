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
import type { PotHistoryEntry } from "@/hooks/useCompetitivePot";
import type { PotActivityEntry } from "@/hooks/usePotActivity";
import { MONAD_EXPLORER_URL } from "@/lib/constants";

interface HistorySectionProps {
  history: PotHistoryEntry[];
  activities: PotActivityEntry[];
  isLoading: boolean;
  isActivityLoading: boolean;
  currentPotId: number;
}

function shortAddress(addr: string): string {
  if (!addr || addr.length < 10 || addr === "0x0000000000000000000000000000000000000000") return "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatDate(timestamp: number): string {
  if (timestamp === 0) return "—";
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatDuration(startTime: number, endTime: number): string {
  if (startTime === 0 || endTime === 0) return "—";
  const seconds = endTime - startTime;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatActivityTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function HistorySection({
  history,
  activities,
  isLoading,
  isActivityLoading,
  currentPotId,
}: HistorySectionProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto py-2 sm:space-y-6">
      <div className="shrink-0">
        <h2 className="text-lg font-bold text-[#2C1810] sm:text-xl md:text-2xl">
          <span className="text-primary">{">"}</span> Pot History
        </h2>
        <p className="mt-1 text-sm font-semibold text-[#5D4E37] sm:mt-2 sm:text-base">
          Past rounds, winners & bid activity
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-xs font-bold text-[#5D4E37] uppercase">Total Rounds</p>
            <p className="mt-2 text-3xl font-black text-[#2C1810]">{currentPotId}</p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#FFD93D] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-xs font-bold text-[#2C1810] uppercase">Completed</p>
            <p className="mt-2 text-3xl font-black text-[#2C1810]">{history.length}</p>
          </div>
        </div>
      </div>

      {/* Bid Activity – from MongoDB */}
      <div className="shrink-0">
        <h3 className="text-base font-bold text-[#2C1810] sm:text-lg">
          💰 Recent Bids
        </h3>
        <p className="text-xs font-semibold text-[#5D4E37] sm:text-sm">
          Bidder, amount & tx per round
        </p>
        <div className="mt-2 overflow-hidden rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="max-h-[240px] overflow-auto p-3 sm:max-h-[280px] sm:p-4">
            {isActivityLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FFD93D] border-t-transparent" />
              </div>
            ) : activities.length === 0 ? (
              <p className="py-6 text-center text-sm font-semibold text-[#5D4E37]">
                No bid activity recorded yet. Bids will appear here after participation.
              </p>
            ) : (
              <Table className="min-w-[340px]">
                <TableHeader>
                  <TableRow className="border-b-2 border-[#2C1810] hover:bg-transparent">
                    <TableHead className="text-xs font-black text-[#2C1810] uppercase w-14">Round</TableHead>
                    <TableHead className="text-xs font-black text-[#2C1810] uppercase">Bidder</TableHead>
                    <TableHead className="text-xs font-black text-[#2C1810] uppercase text-right">Amount</TableHead>
                    <TableHead className="text-xs font-black text-[#2C1810] uppercase text-right">Tx</TableHead>
                    <TableHead className="text-xs font-black text-[#2C1810] uppercase text-right hidden sm:table-cell">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((a) => (
                    <TableRow
                      key={a.id ?? `${a.round}-${a.txHash}-${a.timestamp}`}
                      className="border-b border-[#2C1810]/20 transition-colors hover:bg-[#FFD93D]/15"
                    >
                      <TableCell className="font-bold text-[#2C1810]">
                        <span className="text-sm">#{a.round}</span>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-semibold text-[#2C1810]">
                        {shortAddress(a.bidder)}
                        {a.agentId && (
                          <span className="ml-1 block text-[10px] font-normal text-[#5D4E37]">{a.agentId}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-[#FFD93D] text-[#2C1810] border border-[#2C1810]/50 font-bold text-xs">
                          {a.amountEth} MON
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <a
                          href={`${MONAD_EXPLORER_URL}/tx/${a.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-bold text-[#9333EA] underline-offset-2 hover:underline"
                        >
                          View
                        </a>
                      </TableCell>
                      <TableCell className="text-right text-xs text-[#5D4E37] hidden sm:table-cell">
                        {formatActivityTime(a.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      {/* Rounds & Winners – from chain */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <h3 className="text-base font-bold text-[#2C1810] sm:text-lg">
          🏆 Round Winners
        </h3>
        <div className="mt-2 overflow-hidden rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="max-h-[50vh] overflow-auto overflow-x-auto p-3 sm:max-h-[400px] sm:p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFD93D] border-t-transparent" />
              </div>
            ) : (
              <Table className="min-w-[360px]">
                <TableHeader>
                  <TableRow className="border-b-2 border-[#2C1810] hover:bg-transparent">
                    <TableHead className="text-sm font-black text-[#2C1810] uppercase w-16">Round</TableHead>
                    <TableHead className="text-sm font-black text-[#2C1810] uppercase">Winner</TableHead>
                    <TableHead className="text-sm font-black text-[#2C1810] uppercase text-right">Pot Size</TableHead>
                    <TableHead className="text-sm font-black text-[#2C1810] uppercase text-right hidden sm:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center font-semibold text-[#5D4E37]">
                        No completed pots yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((entry) => (
                      <TableRow
                        key={entry.potId}
                        className="border-b border-[#2C1810]/20 transition-colors hover:bg-[#FFD93D]/20"
                      >
                        <TableCell className="font-black text-[#2C1810]">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">#{entry.potId}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono font-bold text-[#2C1810]">
                          <div className="flex items-center gap-1">
                            <span className="text-lg">🏆</span>
                            {shortAddress(entry.winner)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="border-2 border-[#2C1810] bg-[#FFD93D] font-black text-[#2C1810]">
                            {entry.finalAmountFormatted} MON
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-right text-sm text-[#5D4E37] sm:table-cell">
                          <div>
                            <p>{formatDate(entry.endTime)}</p>
                            <p className="text-xs text-[#5D4E37]/70">{formatDuration(entry.startTime, entry.endTime)}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
