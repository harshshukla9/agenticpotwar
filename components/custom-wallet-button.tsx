"use client";

import { useAccount, useDisconnect, useBalance } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useState, useEffect } from "react";
import { Copy, LogOut, Wallet, ChevronDown } from "lucide-react";
import { AnimatedMoney } from "@/components/animated-number";

export function CustomWalletButton() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { data: balanceData } = useBalance({ address });
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shortenAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center gap-2 rounded-lg border-2 border-[#2C1810]/30 bg-[#FFD93D]/80 px-3 py-2 text-sm font-bold text-[#2C1810] shadow-sm"
      >
        <Wallet className="h-4 w-4" />
        <span>Loading...</span>
      </button>
    );
  }

  if (!isConnected || !address) {
    return (
      <button
        type="button"
        onClick={() => open()}
        className="flex items-center gap-2 rounded-lg border-2 border-[#2C1810]/30 bg-[#FFD93D] px-4 py-2 text-sm font-bold text-[#2C1810] shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 rounded-lg border-2 border-[#2C1810]/30 bg-[#FFD93D] px-3 py-2 text-sm font-bold text-[#2C1810] shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs sm:text-sm">{shortenAddress(address)}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
      </button>

      {showDropdown && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border-2 border-[#2C1810]/30 bg-[#fefcf4] shadow-2xl">
            {/* Balance section */}
            <div className="border-b-2 border-[#2C1810]/10 p-4">
              <p className="mb-2 text-xs font-bold uppercase text-[#5D4E37]">Balance</p>
              <p className="text-2xl font-black text-[#2C1810]">
                {balanceData ? (
                  <AnimatedMoney
                    value={parseFloat(balanceData.formatted)}
                    suffix={` ${balanceData.symbol}`}
                    fontSize={24}
                    color="#2C1810"
                    className="font-black"
                  />
                ) : (
                  "0.0000 MON"
                )}
              </p>
            </div>

            {/* Address section */}
            <div className="border-b-2 border-[#2C1810]/10 p-4">
              <p className="mb-2 text-xs font-bold uppercase text-[#5D4E37]">Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-[#FFD93D]/20 px-2 py-1.5 font-mono text-xs text-[#2C1810]">
                  {shortenAddress(address)}
                </code>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="rounded-lg border-2 border-[#2C1810]/30 bg-white p-2 transition-all hover:bg-[#FFD93D]/60 active:scale-95"
                  title="Copy address"
                >
                  {copied ? (
                    <span className="text-xs text-green-600">✓</span>
                  ) : (
                    <Copy className="h-4 w-4 text-[#2C1810]" />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                type="button"
                onClick={() => {
                  open({ view: "Account" });
                  setShowDropdown(false);
                }}
                className="mb-1 flex w-full items-center gap-3 rounded-lg border-2 border-[#2C1810]/20 bg-white px-4 py-2.5 text-left text-sm font-bold text-[#2C1810] transition-all hover:bg-[#FFD93D]/40 active:scale-95"
              >
                <Wallet className="h-4 w-4" />
                <span>View Account</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg border-2 border-red-200 bg-red-50 px-4 py-2.5 text-left text-sm font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
