"use client";

import { useState, useEffect, useCallback } from "react";

export interface PotActivityEntry {
  id?: string;
  round: number;
  txHash: string;
  bidder: string;
  amountEth: string;
  amountWei?: string;
  agentId?: string;
  agentDetails?: { name?: string; type?: string; metadata?: Record<string, unknown> };
  timestamp: string;
  blockNumber?: number;
}

export function usePotActivity(options?: { round?: number; limit?: number }) {
  const [activities, setActivities] = useState<PotActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (options?.round) params.set("round", String(options.round));
      params.set("limit", String(options?.limit ?? 50));
      const res = await fetch(`/api/pot/activity?${params}`);
      if (!res.ok) {
        setActivities([]);
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.activities)) {
        setActivities(
          data.activities.map((a: PotActivityEntry & { timestamp?: Date | string }) => ({
            ...a,
            timestamp: typeof a.timestamp === "string" ? a.timestamp : (a.timestamp ? new Date(a.timestamp).toISOString() : ""),
          }))
        );
      } else {
        setActivities([]);
      }
    } catch {
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [options?.round, options?.limit]);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 15_000);
    return () => clearInterval(interval);
  }, [fetchActivity]);

  return { activities, isLoading, refetch: fetchActivity };
}
