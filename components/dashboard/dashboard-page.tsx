"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { PoolsSection } from "@/components/sections";
import { LeaderboardSection } from "@/components/sections";
import { ProfileSection } from "@/components/sections";
import { AppKitConnectButton, AppKitAccountButton } from "@reown/appkit/react";
import { useState } from "react";
import { GameRulesDialog } from "@/components/game-rules-dialog";
import { useCurrentPotDetails, useLeaderboard } from "@/hooks/useCompetitivePot";
import { useAccount } from "wagmi";

export type TabId = "pools" | "leaderboard" | "profile";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("pools");
  const [copied, setCopied] = useState(false);
  const { address } = useAccount();
  const { details, isLoading: potLoading } = useCurrentPotDetails();

  const currentPotId = details?.potId ?? 0;
  const { participantCount, leaderboard } = useLeaderboard(currentPotId);

  const totalPoolFormatted = details?.totalFundsFormatted ?? "0";
  const timeRemainingSeconds = details?.timeRemainingSeconds ?? 0;
  const minimumBidFormatted = details?.minimumNextBidFormatted ?? "0";
  const lastBidder = details?.lastBidder ?? "";
  const lastBidFormatted = details?.lastBidAmountFormatted ?? "0";

  const poolData = {
    totalPool: totalPoolFormatted,
    round: currentPotId,
    totalDeposits: participantCount,
    timeRemainingSeconds,
    lastBidder,
    lastBidFormatted,
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSection
            address={address ?? null}
            poolData={{ userDeposits: 0, userTotalDeposited: 0, totalPool: totalPoolFormatted }}
            leaderboard={leaderboard}
            copied={copied}
            copyToClipboard={copyToClipboard}
          />
        );
      case "pools":
        return (
          <PoolsSection
            address={address ?? null}
            poolData={poolData}
            minimumBidFormatted={minimumBidFormatted}
            isMinBidLoading={potLoading}
          />
        );
      case "leaderboard":
        return (
          <LeaderboardSection
            address={address ?? null}
            leaderboard={leaderboard}
            participantCount={participantCount}
            round={currentPotId}
            totalPoolFormatted={totalPoolFormatted}
          />
        );
      default:
        return (
          <div className="text-center text-lg font-bold text-[#2C1810] sm:text-2xl">Pool</div>
        );
    }
  };

  const navItems: { id: TabId; icon: React.ReactNode; label: string; shortLabel: string }[] = [
    { id: "pools", icon: <Image src="/images/assets/lottyRuleta.png" alt="" width={24} height={24} className="shrink-0" />, label: "Pool", shortLabel: "Pool" },
    { id: "leaderboard", icon: <span className="text-lg">🏆</span>, label: "Leaderboard", shortLabel: "Rank" },
    { id: "profile", icon: <Image src="/images/assets/lottyGuy.png" alt="" width={24} height={24} className="shrink-0" />, label: "Profile", shortLabel: "You" },
  ];

  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#fefcf4]">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#2C1810]/20 bg-[#fefcf4] px-3 py-2 safe-area-inset-top md:px-4 md:py-3">
        <div className="flex items-center gap-1.5 rounded-lg border-2 border-[#2C1810]/30 bg-[#FFD93D]/80 px-2.5 py-1.5">
          <span className="text-xs font-bold uppercase text-[#5D4E37]">Pool</span>
          <span className="text-sm font-black text-[#2C1810] sm:text-base">
            {totalPoolFormatted} ETH
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GameRulesDialog />
          {address ? <AppKitAccountButton /> : <AppKitConnectButton />}
        </div>
      </header>

      {/* Scrollable content - full width */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <Card className="min-h-full border-0 bg-transparent p-3 shadow-none md:p-4 lg:p-6">
          <div className="font-sans">{renderContent()}</div>
        </Card>
      </div>

      {/* Bottom nav - Farcaster/mobile friendly, touch targets 48px+ */}
      <nav
        className="flex shrink-0 flex-row items-stretch justify-around gap-0 border-t-2 border-[#2C1810]/20 bg-[#fefcf4] pb-[env(safe-area-inset-bottom)] pt-2"
        role="tablist"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeTab === item.id}
            aria-label={item.label}
            onClick={() => setActiveTab(item.id)}
            className={`flex min-h-[48px] min-w-[44px] flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-center transition-colors active:scale-95 ${
              activeTab === item.id
                ? "bg-[#FFD93D] text-[#2C1810] shadow-[0_-2px_0_0_rgba(44,24,16,0.3)]"
                : "text-[#5D4E37]"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center [&>img]:h-5 [&>img]:w-5 sm:[&>img]:h-6 sm:[&>img]:w-6">
              {item.icon}
            </span>
            <span className="text-[10px] font-bold leading-tight sm:text-xs">{item.shortLabel}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
