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

interface HistorySectionProps {
  history: PotHistoryEntry[];
  isLoading: boolean;
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

export function HistorySection({ history, isLoading, currentPotId }: HistorySectionProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto py-2 sm:space-y-6">
      <div className="shrink-0">
        <h2 className="text-lg font-bold text-[#2C1810] sm:text-xl md:text-2xl">
          <span className="text-primary">{">"}</span> Pot History
        </h2>
        <p className="mt-1 text-sm font-semibold text-[#5D4E37] sm:mt-2 sm:text-base">
          Past rounds and their winners
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

      {/* History table */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="overflow-hidden rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="max-h-[50vh] overflow-auto overflow-x-auto p-3 sm:max-h-[600px] sm:p-4 md:p-6">
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
                      <TableCell colSpan={4} className="text-center font-semibold text-[#5D4E37] py-8">
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
                          <Badge className="bg-[#FFD93D] text-[#2C1810] border-2 border-[#2C1810] font-black">
                            {entry.finalAmountFormatted} ETH
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm text-[#5D4E37] hidden sm:table-cell">
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
