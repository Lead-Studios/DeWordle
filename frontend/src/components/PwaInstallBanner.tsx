"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/** localStorage key holding the timestamp of the last dismissal. */
export const PWA_DISMISSAL_STORAGE_KEY = "dewordle:pwa-install-dismissed-at";

/** A dismissed banner stays hidden for seven days. */
export const PWA_DISMISSAL_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Minimal shape of the non-standard `beforeinstallprompt` event. Chrome-based
 * browsers fire it when the PWA install criteria are met.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

/** Whether the install banner was dismissed within the last seven days. */
export function isPwaPromptDismissed(now: number = Date.now()): boolean {
  try {
    const raw = window.localStorage.getItem(PWA_DISMISSAL_STORAGE_KEY);
    if (!raw) return false;

    const dismissedAt = Number.parseInt(raw, 10);
    if (!Number.isFinite(dismissedAt)) return false;

    return now - dismissedAt < PWA_DISMISSAL_WINDOW_MS;
  } catch {
    // Storage can be unavailable (private mode); treat as not dismissed.
    return false;
  }
}

export function PwaInstallBanner() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [visible, setVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (isPwaPromptDismissed()) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      // Keep the event around so the banner button can trigger it later.
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const handleInstalled = () => {
      setVisible(false);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(
        PWA_DISMISSAL_STORAGE_KEY,
        String(Date.now()),
      );
    } catch {
      // Ignore storage failures — the banner is simply shown again later.
    }
    setVisible(false);
    setPromptEvent(null);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!promptEvent) return;

    setIsInstalling(true);
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") {
        setVisible(false);
      } else {
        dismiss();
      }
      setPromptEvent(null);
    } finally {
      setIsInstalling(false);
    }
  }, [dismiss, promptEvent]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Install DeWordle"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md flex-col gap-3 rounded-2xl border border-white/10 bg-primary-900/95 p-4 text-white shadow-2xl backdrop-blur"
    >
      <div className="flex items-start gap-3">
        <Image
          alt="DeWordle app icon"
          src="/logo.svg"
          width={40}
          height={40}
          className="rounded-lg bg-primary-950 p-1"
        />
        <div className="flex-1">
          <p className="font-clash text-sm tracking-wide">
            Install DeWordle
          </p>
          <p className="text-xs text-white/70">
            Add the game to your home screen for a full-screen, faster
            experience.
          </p>
        </div>
        <button
          type="button"
          aria-label="Dismiss install prompt"
          onClick={dismiss}
          className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          ✕
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isInstalling}
          onClick={() => {
            void handleInstall();
          }}
          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-white"
        >
          {isInstalling ? "Installing…" : "Add to Home Screen"}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
