/**
 * #1425 letter frequency on loss, #1426 hard mode, #1427 streak badge,
 * #1428 color-blind palette.
 */
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  SessionResultCard,
  computeLetterFrequencies,
  type SessionResultData,
} from "@/components/SessionResultCard";
import { SettingsPanel } from "@/components/SettingsPanel";
import { SettingsProvider } from "@/providers/settings-provider";
import { StreakBadgeView } from "@/components/StreakBadge";
import { usePlayerStreak } from "@/hooks/usePlayerStreak";
import GameTile from "@/components/GameTile";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { guardHardModeGuess } from "@/lib/hard-mode";
import { clearToasts } from "@/store/useToastStore";
import * as toastStore from "@/store/useToastStore";

const base: SessionResultData = {
  kind: "daily",
  word: "APPLE",
  won: false,
  guessCount: 6,
  streak: 0,
};

describe("#1425 letter frequency hints", () => {
  it("computes counts per letter, most frequent first", () => {
    expect(computeLetterFrequencies("apple")).toEqual([
      { letter: "P", count: 2 },
      { letter: "A", count: 1 },
      { letter: "E", count: 1 },
      { letter: "L", count: 1 },
    ]);
  });

  it("renders a bar per letter with its count on loss", () => {
    render(<SessionResultCard result={base} />);
    expect(screen.getByRole("heading", { name: /letter frequency/i })).toBeInTheDocument();
    const bars = screen.getAllByTestId("letter-frequency-bar");
    expect(bars).toHaveLength(4);
    expect(bars[0]).toHaveAttribute("data-letter", "P");
    expect(bars[0]).toHaveAttribute("data-count", "2");
    expect(bars[0].querySelector('rect[fill="var(--primary)"]')).not.toBeNull();
  });

  it("is hidden on win results", () => {
    render(<SessionResultCard result={{ ...base, won: true, guessCount: 3 }} />);
    expect(screen.queryByTestId("letter-frequency-bar")).not.toBeInTheDocument();
  });

  it("is hidden for interrupted sessions", () => {
    render(<SessionResultCard result={{ ...base, kind: "interrupted", word: "" }} />);
    expect(screen.queryByTestId("letter-frequency-bar")).not.toBeInTheDocument();
  });
});

describe("#1426 hard mode", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    clearToasts();
    vi.restoreAllMocks();
  });

  it("toggle is available in SettingsPanel and persists", () => {
    const { unmount } = render(
      <SettingsProvider>
        <SettingsPanel />
      </SettingsProvider>,
    );
    const toggle = screen.getByRole("switch", { name: /toggle hard mode/i });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(JSON.parse(localStorage.getItem("dewordle-settings")!).hardMode).toBe(true);
    unmount();

    render(
      <SettingsProvider>
        <SettingsPanel />
      </SettingsProvider>,
    );
    expect(screen.getByRole("switch", { name: /toggle hard mode/i })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("shows an explanatory toast for invalid guesses when enabled", () => {
    const spy = vi.spyOn(toastStore, "pushToast");
    const history = [
      { guess: "CRANE", statuses: ["absent", "correct", "absent", "absent", "absent"] as const },
    ].map((g) => ({ ...g, statuses: [...g.statuses] }));
    expect(guardHardModeGuess("BLIMP", history, true)).toBe(false);
    expect(spy).toHaveBeenCalledWith("Hard mode: 2nd letter must be R", { tone: "warning" });
  });

  it("allows any guess when disabled", () => {
    const history = [
      { guess: "CRANE", statuses: ["absent", "correct", "absent", "absent", "absent" as const] },
    ] as Parameters<typeof guardHardModeGuess>[1];
    expect(guardHardModeGuess("BLIMP", history, false)).toBe(true);
  });
});

describe("#1427 streak badge", () => {
  it("shows the streak count", () => {
    render(<StreakBadgeView streak={3} />);
    expect(screen.getByTestId("streak-badge")).toHaveTextContent("3");
    expect(screen.getByTestId("streak-badge")).not.toHaveTextContent("🔥");
  });

  it("adds a flame for streaks of 7 or more", () => {
    render(<StreakBadgeView streak={7} />);
    expect(screen.getByTestId("streak-badge")).toHaveTextContent("🔥");
  });

  it("shows a skeleton while loading", () => {
    render(<StreakBadgeView streak={null} loading />);
    expect(screen.getByRole("status", { name: /loading streak/i })).toBeInTheDocument();
  });

  it("pulses when the streak increases", () => {
    const { rerender } = render(<StreakBadgeView streak={2} />);
    expect(screen.getByTestId("streak-badge").className).not.toContain("streak-pulse");
    rerender(<StreakBadgeView streak={3} />);
    expect(screen.getByTestId("streak-badge").className).toContain("streak-pulse");
  });

  it("reads currentStreak from the player summary projection API", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ streak: { currentStreak: 9 } }),
    }) as unknown as typeof fetch;
    function Probe() {
      const { streak } = usePlayerStreak("GABC", { fetchImpl, apiBase: "http://api" });
      return <span data-testid="value">{streak ?? "none"}</span>;
    }
    render(<Probe />);
    await waitFor(() => expect(screen.getByTestId("value")).toHaveTextContent("9"));
    expect(fetchImpl).toHaveBeenCalledWith("http://api/api/v1/players/GABC/summary");
  });
});

describe("#1428 color-blind mode", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-color-blind");
  });

  it("toggling sets the palette attribute on <html> and persists", async () => {
    render(
      <SettingsProvider>
        <SettingsPanel />
      </SettingsProvider>,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("switch", { name: /toggle color-blind mode/i }));
    });
    expect(document.documentElement.getAttribute("data-color-blind")).toBe("true");
    expect(JSON.parse(localStorage.getItem("dewordle-settings")!).colorBlindMode).toBe(true);

    await act(async () => {
      fireEvent.click(screen.getByRole("switch", { name: /toggle color-blind mode/i }));
    });
    expect(document.documentElement.hasAttribute("data-color-blind")).toBe(false);
  });

  it("tiles and keyboard keys use the shared palette tokens", () => {
    render(
      <>
        <GameTile letter="A" state="correct" />
        <VirtualKeyboard
          onKeyPress={() => {}}
          onEnter={() => {}}
          onBackspace={() => {}}
          keyStatuses={{ Q: "present" }}
        />
      </>,
    );
    expect(screen.getByLabelText("Letter A, correct").className).toContain("bg-[var(--tile-correct)]");
    expect(screen.getByRole("button", { name: "Letter Q" }).className).toContain(
      "bg-[var(--tile-present)]",
    );
  });
});
