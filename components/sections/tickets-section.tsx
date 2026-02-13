"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DepositForm } from "@/components/forms/deposit-form";
import { useState } from "react";

interface DepositsSectionProps {
  address: string | null;
  depositAmount: number;
  setDepositAmount: (amount: number) => void;
  userDeposits: Array<{
    id: string;
    amount: string;
    date: string;
    timestamp: number;
    playerAddress: string;
  }>;
  onDeposit?: (deposit: {
    id: string;
    amount: string;
    date: string;
    timestamp: number;
    playerAddress: string;
  }) => void;
}

export function DepositsSection({
  address,
  depositAmount,
  setDepositAmount,
  userDeposits,
  onDeposit,
}: DepositsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasDeposits = userDeposits.length > 0;

  if (!hasDeposits) {
    return (
      <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto py-2 sm:space-y-6">
        <div className="shrink-0">
          <h2 className="text-lg font-bold text-[#2C1810] sm:text-xl md:text-2xl">
            <span className="text-primary">{">"}</span> Deposit to Pool
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#5D4E37] sm:mt-2 sm:text-base">
            Make your first deposit and try to be the last one!
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center p-2">
          <div className="w-full max-w-md rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] sm:rounded-2xl sm:border-4 sm:p-6 sm:shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
            <DepositForm
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              address={address}
              isInline={true}
              onDeposit={(deposit) => {
                onDeposit?.(deposit);
                setIsDialogOpen(false);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto py-2 sm:space-y-6">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#2C1810] sm:text-xl md:text-2xl">
          <span className="text-primary">{">"}</span> Your Deposits
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground min-h-[44px] touch-manipulation border-2 border-[#2C1810] px-5 text-sm font-black uppercase shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-transform active:scale-95 sm:h-12 sm:border-4 sm:px-8 sm:text-base sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <span className="text-primary-foreground">{">"} DEPOSIT</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="border-4 border-[#2C1810] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-[#2C1810]">Deposit to Pool</DialogTitle>
              <DialogDescription className="font-semibold text-[#5D4E37]">
                Enter the amount you want to deposit
              </DialogDescription>
            </DialogHeader>
            <DepositForm
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              address={address}
              onDeposit={(deposit) => {
                onDeposit?.(deposit);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <div className="h-full overflow-auto p-3 sm:p-4 md:p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-[#2C1810] hover:bg-transparent">
                <TableHead className="text-sm font-black text-[#2C1810] uppercase">Deposit ID</TableHead>
                <TableHead className="text-sm font-black text-[#2C1810] uppercase">Amount</TableHead>
                <TableHead className="text-sm font-black text-[#2C1810] uppercase">Date & Time</TableHead>
                <TableHead className="text-right text-sm font-black text-[#2C1810] uppercase">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...userDeposits].sort((a, b) => b.timestamp - a.timestamp).map((deposit) => (
                <TableRow key={deposit.id} className="border-b border-[#2C1810]/20 transition-colors hover:bg-[#FFD93D]/20">
                  <TableCell className="font-black text-[#2C1810]">{deposit.id}</TableCell>
                  <TableCell>
                    <Badge className="bg-primary text-primary-foreground border-2 border-[#2C1810] font-black">
                      {deposit.amount}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-[#5D4E37]">
                    {deposit.date} {new Date(deposit.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-[#fefcf4] text-[#2C1810] border-2 border-[#2C1810] font-black">Active</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
