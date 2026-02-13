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

interface TransactionHistorySectionProps {
  address: string | null;
}

const mockTransactions = [
  { id: "#TX001", agentName: "Agent Alpha", agentAddress: "AgentA1B2...", amount: "$250.00", timestamp: Date.now() - 300000, status: "completed", type: "deposit" },
  { id: "#TX002", agentName: "Agent Beta", agentAddress: "AgentB3C4...", amount: "$150.00", timestamp: Date.now() - 600000, status: "completed", type: "deposit" },
  { id: "#TX003", agentName: "Agent Gamma", agentAddress: "AgentG5D6...", amount: "$500.00", timestamp: Date.now() - 900000, status: "completed", type: "deposit" },
  { id: "#TX004", agentName: "Agent Delta", agentAddress: "AgentD7E8...", amount: "$100.00", timestamp: Date.now() - 1200000, status: "completed", type: "deposit" },
  { id: "#TX005", agentName: "Agent Epsilon", agentAddress: "AgentE9F0...", amount: "$300.00", timestamp: Date.now() - 1800000, status: "completed", type: "deposit" },
  { id: "#TX006", agentName: "Agent Alpha", agentAddress: "AgentA1B2...", amount: "$175.00", timestamp: Date.now() - 2400000, status: "completed", type: "deposit" },
  { id: "#TX007", agentName: "Agent Zeta", agentAddress: "AgentZ1A2...", amount: "$425.00", timestamp: Date.now() - 3000000, status: "completed", type: "deposit" },
  { id: "#TX008", agentName: "Agent Beta", agentAddress: "AgentB3C4...", amount: "$200.00", timestamp: Date.now() - 3600000, status: "completed", type: "deposit" },
  { id: "#TX009", agentName: "Agent Theta", agentAddress: "AgentT3H4...", amount: "$350.00", timestamp: Date.now() - 4200000, status: "completed", type: "deposit" },
  { id: "#TX010", agentName: "Agent Gamma", agentAddress: "AgentG5D6...", amount: "$125.00", timestamp: Date.now() - 4800000, status: "completed", type: "deposit" },
];

const formatTimeAgo = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

export function TransactionHistorySection({ address }: TransactionHistorySectionProps) {
  const totalAmount = mockTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount.replace("$", "")), 0);
  const uniqueAgents = new Set(mockTransactions.map((tx) => tx.agentName)).size;

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto py-2 sm:space-y-6">
      <div className="shrink-0">
        <h2 className="text-lg font-bold text-[#2C1810] sm:text-xl md:text-2xl">
          <span className="text-primary">{">"}</span> Transaction History
        </h2>
        <p className="mt-1 text-sm font-semibold text-[#5D4E37] sm:mt-2 sm:text-base">
          Complete history of agent transactions and deposits
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-xs font-bold text-[#5D4E37] uppercase">Total Transactions</p>
            <p className="mt-1 text-2xl font-black text-[#2C1810] sm:mt-2 sm:text-3xl">{mockTransactions.length}</p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#FFD93D] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-xs font-bold text-[#2C1810] uppercase">Total Amount</p>
            <p className="mt-1 text-xl font-black text-[#2C1810] sm:mt-2 sm:text-2xl">${totalAmount.toFixed(2)}</p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-5 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-xs font-bold text-[#5D4E37] uppercase">Active Agents</p>
            <p className="mt-1 text-2xl font-black text-[#2C1810] sm:mt-2 sm:text-3xl">{uniqueAgents}</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="overflow-hidden rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <div className="max-h-[45vh] overflow-auto p-3 sm:max-h-[500px] sm:p-4 md:p-6">
            <div className="overflow-x-auto">
            <Table className="min-w-[480px]">
              <TableHeader>
                <TableRow className="border-b-2 border-[#2C1810] hover:bg-transparent">
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase w-24">Transaction ID</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase">Agent Name</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase">Agent Address</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase text-right">Amount</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase text-right">Time</TableHead>
                  <TableHead className="text-sm font-black text-[#2C1810] uppercase text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((transaction, idx) => (
                  <TableRow
                    key={transaction.id}
                    className={`border-b border-[#2C1810]/20 transition-colors hover:bg-[#FFD93D]/20 ${idx === 0 ? "bg-[#FFD93D]/30" : ""}`}
                  >
                    <TableCell className="font-black text-[#2C1810]">{transaction.id}</TableCell>
                    <TableCell>
                      <span className="font-black text-[#2C1810]">{transaction.agentName}</span>
                    </TableCell>
                    <TableCell className="font-semibold text-[#5D4E37]">{transaction.agentAddress}</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-[#FFD93D] text-[#2C1810] border-2 border-[#2C1810] font-black">
                        {transaction.amount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-[#5D4E37]">
                      {formatTimeAgo(transaction.timestamp)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-primary text-primary-foreground border-2 border-[#2C1810] font-black">
                        {transaction.status.toUpperCase()}
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
