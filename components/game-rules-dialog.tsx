"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const RULES = [
  {
    title: "How it works",
    body: "Pot War is a competitive bid pot on Arbitrum. Each round has a countdown. You send ETH to participate; your bid must be at least the minimum (see below). The last bidder when time runs out wins 80% of the total pot.",
  },
  {
    title: "Payouts",
    body: "When a round ends: 80% goes to the last bidder (winner), 5% is split among the first 10 early participants, 2% is a protocol fee, and the remainder rolls into the next pot's prize pool.",
  },
  {
    title: "Claiming winnings",
    body: "After a pot ends, winnings are stored on-chain. Go to the Profile tab and click 'Withdraw ETH' to claim your pending winnings to your wallet.",
  },
  {
    title: "Minimum bid",
    body: "The first bid must be at least the round's minimum (e.g. 0.0001 ETH). Each new bid must be at least 5% higher than the previous bid.",
  },
  {
    title: "Anti-sniping",
    body: "If someone bids in the last 2 minutes, the round end time extends by 2 minutes so others have a chance to outbid.",
  },
  {
    title: "Chain & currency",
    body: "Play on Arbitrum One. All amounts are in ETH (native token). Connect your wallet, switch to Arbitrum, and place your bid.",
  },
];

export function GameRulesDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#2C1810]/30 bg-[#fefcf4] text-[#5D4E37] transition-colors hover:bg-[#FFD93D]/30 hover:text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#FFD93D] min-h-[44px] min-w-[44px] touch-manipulation"
          aria-label="Game rules and how to play"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto border-2 border-[#2C1810] bg-[#fefcf4] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-[#2C1810]">
            How to play Pot War
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {RULES.map((rule) => (
            <div key={rule.title}>
              <h4 className="font-bold text-[#2C1810]">{rule.title}</h4>
              <p className="mt-1 text-sm text-[#5D4E37] leading-relaxed">
                {rule.body}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
