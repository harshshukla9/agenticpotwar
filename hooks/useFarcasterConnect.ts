"use client";

import { useEffect, useRef } from "react";
import { useAccount, useConnect } from "wagmi";

/**
 * Auto-connects the Farcaster MiniApp wallet connector when inside Farcaster.
 * Falls back gracefully if not in a Farcaster context.
 */
export function useFarcasterAutoConnect() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const attempted = useRef(false);

  useEffect(() => {
    if (isConnected || attempted.current) return;
    attempted.current = true;

    // Find the Farcaster MiniApp connector (id is "farcaster", name is "Farcaster")
    const farcasterConnector = connectors.find(
      (c) => c.id === "farcaster" || c.name === "Farcaster"
    );

    if (!farcasterConnector) return;

    // Brief delay so Farcaster SDK can inject ethProvider in frame context
    const t = setTimeout(() => {
      try {
        connect({ connector: farcasterConnector });
      } catch {
        // Not in Farcaster context or provider not ready, ignore
      }
    }, 300);
    return () => clearTimeout(t);
  }, [isConnected, connect, connectors]);
}

/**
 * Hook to manually trigger Farcaster wallet connection.
 * Returns { connectFarcaster, hasFarcasterConnector }
 */
export function useFarcasterManualConnect() {
  const { connect, connectors, isPending } = useConnect();

  const farcasterConnector = connectors.find(
    (c) => c.id === "farcaster" || c.name === "Farcaster"
  );

  const connectFarcaster = () => {
    if (farcasterConnector) {
      connect({ connector: farcasterConnector });
    }
  };

  return {
    connectFarcaster,
    hasFarcasterConnector: Boolean(farcasterConnector),
    isPending,
  };
}
