"use client";

import { useState } from "react";
import { useFrame } from "@/components/farcaster-provider";

export type PotShareType = "pool" | "bid_placed" | "leading";

export interface PotShareData {
  round: number;
  totalPool: string;
  participantCount: number;
  timeRemainingFormatted?: string;
  minBid?: string;
  lastBidderShort?: string;
  lastBidFormatted?: string;
  /** For bid_placed */
  myBidAmount?: string;
  /** For leading */
  myContribution?: string;
  rank?: number;
}

function generatePotCastText(type: PotShareType, data: PotShareData): string {
  const roundLine = `Round #${data.round} on Pot War`;
  switch (type) {
    case "pool":
      return `💰 Pot War on Arbitrum

${roundLine}

🏆 Pool: ${data.totalPool} ETH
👥 ${data.participantCount} participant${data.participantCount !== 1 ? "s" : ""}
${data.timeRemainingFormatted ? `⏱️ Ends in ${data.timeRemainingFormatted}` : ""}
${data.minBid ? `📈 Min bid: ${data.minBid} ETH` : ""}
${data.lastBidderShort && data.lastBidFormatted ? `Current leader: ${data.lastBidderShort} (${data.lastBidFormatted} ETH)` : ""}

Last bidder wins 80%. Bid now! 🚀

#PotWar #Arbitrum #Farcaster`;

    case "bid_placed":
      return `🎯 Just placed my bid on Pot War!

${roundLine}

💵 My bid: ${data.myBidAmount ?? "—"} ETH
💰 Pool total: ${data.totalPool} ETH
👥 ${data.participantCount} in the pot

Think you can outbid me? Last bidder takes 80%! 🔥

#PotWar #Arbitrum #Farcaster`;

    case "leading":
      return `🏆 I'm #${data.rank ?? 1} on Pot War!

${roundLine}

📊 My contribution: ${data.myContribution ?? "—"} ETH
💰 Pool: ${data.totalPool} ETH
👥 ${data.participantCount} participants

Top the leaderboard before time runs out! ⏱️

#PotWar #Arbitrum #Farcaster`;

    default:
      return `Check out Pot War on Arbitrum – ${roundLine}. Last bidder wins 80%! #PotWar #Arbitrum`;
  }
}

interface ShareToFarcasterProps {
  type: PotShareType;
  data: PotShareData;
  className?: string;
  variant?: "button" | "icon";
  size?: "sm" | "md";
  onClose?: () => void;
}

function openWarpcastFallback(text: string, url: string) {
  const encoded = encodeURIComponent(text);
  const warpcastUrl = `https://warpcast.com/~/compose?text=${encoded}&embeds[]=${encodeURIComponent(url)}`;
  window.open(warpcastUrl, "_blank", "noopener,noreferrer");
}

/** Hook to trigger share programmatically (e.g. after bid success). */
export function useShareToFarcaster() {
  const { actions } = useFrame();
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  const share = async (type: PotShareType, data: PotShareData) => {
    const castText = generatePotCastText(type, data);
    if (actions?.composeCast) {
      try {
        await actions.composeCast({ text: castText, embeds: [appUrl] });
      } catch (err) {
        console.error("Share failed:", err);
        openWarpcastFallback(castText, appUrl);
      }
    } else {
      openWarpcastFallback(castText, appUrl);
    }
  };

  return { share };
}

const FarcasterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 1000 1000" fill="currentColor">
    <path d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z" />
    <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" />
    <path d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.444H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z" />
  </svg>
);

export function ShareToFarcaster({
  type,
  data,
  className = "",
  variant = "icon",
  size = "md",
  onClose,
}: ShareToFarcasterProps) {
  const { actions } = useFrame();
  const [isSharing, setIsSharing] = useState(false);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleShare = async () => {
    const castText = generatePotCastText(type, data);
    if (actions?.composeCast) {
      setIsSharing(true);
      try {
        await actions.composeCast({
          text: castText,
          embeds: [appUrl],
        });
        onClose?.();
      } catch (err) {
        console.error("Share failed:", err);
        openWarpcastFallback(castText, appUrl);
      } finally {
        setIsSharing(false);
      }
    } else {
      openWarpcastFallback(castText, appUrl);
    }
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleShare}
        disabled={isSharing}
        className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg hover:bg-[#8A63D2]/10 transition-colors disabled:opacity-50 text-[#8A63D2] touch-manipulation ${className}`}
        title="Share to Farcaster"
        aria-label="Share to Farcaster"
      >
        {isSharing ? (
          <svg className={`animate-spin ${iconSize}`} viewBox="0 0 24 24" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <FarcasterIcon className={iconSize} />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isSharing}
      className={`flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.98] bg-[#8A63D2] hover:bg-purple-700 text-white disabled:opacity-70 px-4 py-3 text-sm min-h-[44px] touch-manipulation ${className}`}
    >
      {isSharing ? (
        <>
          <svg className={`animate-spin ${iconSize}`} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Sharing...</span>
        </>
      ) : (
        <>
          <FarcasterIcon className={iconSize} />
          <span>Share to Farcaster</span>
        </>
      )}
    </button>
  );
}
