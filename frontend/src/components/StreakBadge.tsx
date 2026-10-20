"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlayerStreak } from "@/hooks/usePlayerStreak";

export const FLAME_STREAK_THRESHOLD = 7;

interface StreakBadgeViewProps {
  streak: number | null;
  loading?: boolean;
}

/** Presentational streak badge; pulses whenever the streak increases. */
export function StreakBadgeView({ streak, loading = false }: StreakBadgeViewProps) {
  const previous = useRef<number | null>(null);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (streak === null) return;
    if (previous.current !== null && streak > previous.current) {
      setPulseKey((key) => key + 1);
    }
    previous.current = streak;
  }, [streak]);

  if (loading && streak === null) {
    return (
      <div role="status" aria-label="Loading streak" className="inline-flex">
        <Skeleton className="h-7 w-14 rounded-full" />
      </div>
    );
  }

  if (streak === null) return null;

  const onFire = streak >= FLAME_STREAK_THRESHOLD;

  return (
    <span
      key={pulseKey}
      data-testid="streak-badge"
      aria-label={`Current daily streak: ${streak} day${streak === 1 ? "" : "s"}`}
      className={`inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white ${
        pulseKey > 0 ? "streak-pulse" : ""
      }`}
    >
      {onFire && <span aria-hidden="true">🔥</span>}
      <span>{streak}</span>
      <span className="text-xs font-normal text-gray-300">day{streak === 1 ? "" : "s"}</span>
    </span>
  );
}

/** Header streak counter fed by the player stats projection API. */
export function StreakBadge({ address }: { address: string | null | undefined }) {
  const { streak, loading } = usePlayerStreak(address);
  if (!address) return null;
  return <StreakBadgeView streak={streak} loading={loading} />;
}
