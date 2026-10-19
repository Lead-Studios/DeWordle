"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface PlayerStreakState {
  streak: number | null;
  loading: boolean;
  error: string | null;
}

/**
 * Current daily streak from the player stats projection
 * (`GET /api/v1/players/:address/summary`).
 */
export function usePlayerStreak(
  address: string | null | undefined,
  { fetchImpl = fetch, apiBase = API_BASE }: { fetchImpl?: typeof fetch; apiBase?: string } = {},
): PlayerStreakState {
  const [state, setState] = useState<PlayerStreakState>({
    streak: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!address) {
      setState({ streak: null, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetchImpl(`${apiBase}/api/v1/players/${encodeURIComponent(address)}/summary`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Player summary fetch failed with status ${res.status}`);
        const body = (await res.json()) as { streak?: { currentStreak?: unknown } } | null;
        const current = Number(body?.streak?.currentStreak ?? 0);
        if (!cancelled) {
          setState({ streak: Number.isFinite(current) ? current : 0, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            streak: null,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load streak",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [address, apiBase, fetchImpl]);

  return state;
}
