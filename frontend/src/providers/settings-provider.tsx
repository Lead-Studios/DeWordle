"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type GameSettings = {
  colorBlindMode: boolean;
  soundEffects: boolean;
  showDifficultyBadge: boolean;
  /** Guesses must reuse every revealed correct/present letter (#1426). */
  hardMode: boolean;
};

type SettingsContextValue = GameSettings & {
  setColorBlindMode: (enabled: boolean) => void;
  setSoundEffects: (enabled: boolean) => void;
  setShowDifficultyBadge: (enabled: boolean) => void;
  setHardMode: (enabled: boolean) => void;
};

const STORAGE_KEY = "dewordle-settings";

const defaults: GameSettings = {
  colorBlindMode: false,
  soundEffects: false,
  showDifficultyBadge: true,
  hardMode: false,
};

function loadSettings(): GameSettings {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

function persistSettings(settings: GameSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage full or unavailable
  }
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(defaults);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  // Drives the tile/keyboard palette overrides in globals.css (#1428).
  useEffect(() => {
    const root = document.documentElement;
    if (settings.colorBlindMode) {
      root.setAttribute("data-color-blind", "true");
    } else {
      root.removeAttribute("data-color-blind");
    }
  }, [settings.colorBlindMode]);

  const setColorBlindMode = useCallback((enabled: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, colorBlindMode: enabled };
      persistSettings(next);
      return next;
    });
  }, []);

  const setSoundEffects = useCallback((enabled: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, soundEffects: enabled };
      persistSettings(next);
      return next;
    });
  }, []);

  const setShowDifficultyBadge = useCallback((enabled: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, showDifficultyBadge: enabled };
      persistSettings(next);
      return next;
    });
  }, []);

  const setHardMode = useCallback((enabled: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, hardMode: enabled };
      persistSettings(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      ...settings,
      setColorBlindMode,
      setSoundEffects,
      setShowDifficultyBadge,
      setHardMode,
    }),
    [settings, setColorBlindMode, setSoundEffects, setShowDifficultyBadge, setHardMode],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
