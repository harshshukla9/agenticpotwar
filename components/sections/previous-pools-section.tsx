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

interface PreviousPoolsSectionProps {
  address: string | null;
}

const mockPoolHistory = [
  { poolId: "#847", date: "2024-01-20", totalPool: "$12,450", winner: "AgentA3F...", totalDeposits: 247, winnerAmount: "$12,450" },
  { poolId: "#846", date: "2024-01-13", totalPool: "$11,230", winner: "AgentB2E...", totalDeposits: 223, winnerAmount: "$11,230" },
  { poolId: "#845", date: "2024-01-06", totalPool: "$10,890", winner: "AgentC1D...", totalDeposits: 198, winnerAmount: "$10,890" },
  { poolId: "#844", date: "2023-12-30", totalPool: "$9,650", winner: "AgentD8F...", totalDeposits: 190, winnerAmount: "$9,650" },
  { poolId: "#843", date: "2023-12-23", totalPool: "$13,200", winner: "AgentE5K...", totalDeposits: 256, winnerAmount: "$13,200" },
  { poolId: "#842", date: "2023-12-16", totalPool: "$8,950", winner: "AgentF9M...", totalDeposits: 178, winnerAmount: "$8,950" },
  { poolId: "#841", date: "2023-12-09", totalPool: "$10,100", winner: "AgentG2N...", totalDeposits: 201, winnerAmount: "$10,100" },
  { poolId: "#840", date: "2023-12-02", totalPool: "$9,200", winner: "AgentH7P...", totalDeposits: 185, winnerAmount: "$9,200" },
  { poolId: "#839", date: "2023-11-25", totalPool: "$11,500", winner: "AgentI3Q...", totalDeposits: 234, winnerAmount: "$11,500" },
  { poolId: "#838", date: "2023-11-18", totalPool: "$7,800", winner: "AgentJ8R...", totalDeposits: 156, winnerAmount: "$7,800" },
];

export function PreviousPoolsSection({ address }: PreviousPoolsSectionProps) {
  const totalPools = mockPoolHistory.length;
  const totalWinnings = mockPoolHistory.reduce(
    (sum, pool) => sum + parseFloat(pool.totalPool.replace("$", "").replace(",", "")),
    0
  );
  const totalDeposits = mockPoolHistory.reduce((sum, pool) => sum + pool.totalDeposits, 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto py-2 sm:space-y-6">
      <div className="shrink-0">
        <h2 className="text-lg font-bold text-[#2C1810] sm:text-xl md:text-2xl">
          <span className="text-primary">{">"}</span> Previous Pools
        </h2>
        <p className="mt-1 text-sm font-semibold text-[#5D4E37] sm:mt-2 sm:text-base">
          Historical pool results and winners
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-xs font-bold text-[#5D4E37] uppercase">Total Pools</p>
            <p className="mt-1 text-2xl font-black text-[#2C1810] sm:mt-2 sm:text-3xl">{totalPools}</p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#FFD93D] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-xs font-bold text-[#2C1810] uppercase">Total Winnings</p>
            <p className="mt-1 text-xl font-black text-[#2C1810] sm:mt-2 sm:text-2xl">${(totalWinnings / 1000).toFixed(1)}K</p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-xs font-bold text-[#5D4E37] uppercase">Total Deposits</p>
            <p className="mt-1 text-2xl font-black text-[#2C1810] sm:mt-2 sm:text-3xl">{totalDeposits}</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="overflow-hidden rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="max-h-[45vh] overflow-auto p-3 sm:max-h-[500px] sm:p-4 md:p-6">
            <div className="overflow-x-auto">
            <Table className="min-w-[420px]">
              <TableHeader>
                <TableRow className="border-b-2 border-[#2C1810] hover:bg-transparent">
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase">Pool ID</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase">Date</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase">Total Pool</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase">Winner</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase text-center">Deposits</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase text-right">Winner Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPoolHistory.map((record, idx) => (
                  <TableRow
                    key={record.poolId}
                    className={`border-b border-[#2C1810]/20 transition-colors hover:bg-[#FFD93D]/20 ${idx === 0 ? "bg-[#FFD93D]/30" : ""}`}
                  >
                    <TableCell className="font-black text-[#2C1810]">{record.poolId}</TableCell>
                    <TableCell className="font-semibold text-[#5D4E37]">{record.date}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary text-primary-foreground border-2 border-[#2C1810] font-black">
                        {record.totalPool}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-[#5D4E37]">{record.winner}</TableCell>
                    <TableCell className="text-center font-black text-[#2C1810]">{record.totalDeposits}</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-[#FFD93D] text-[#2C1810] border-2 border-[#2C1810] font-black">
                        {record.winnerAmount}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
