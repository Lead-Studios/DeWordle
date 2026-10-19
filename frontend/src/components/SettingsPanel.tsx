"use client";

import { useState } from "react";
import { useSettings } from "@/providers/settings-provider";

export function SettingsPanel() {
  const {
    colorBlindMode,
    setColorBlindMode,
    soundEffects,
    setSoundEffects,
    showDifficultyBadge,
    setShowDifficultyBadge,
    hardMode,
    setHardMode,
  } = useSettings();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleResetData = () => {
    localStorage.removeItem("dewordle_game_stats");
    localStorage.removeItem("dewordle_session_history");
    localStorage.removeItem("dewordle_offline_state");
    setShowConfirmModal(false);
  };

  return (
    <div
      role="region"
      aria-label="Game settings"
      className="flex flex-col gap-4 rounded-lg border border-white/10 bg-dark-200/50 p-4"
    >
      <div className="flex items-center justify-between">
        <label
          htmlFor="colorblind-toggle"
          className="cursor-pointer select-none text-sm font-medium text-gray-300"
        >
          Color-blind mode
        </label>
        <button
          id="colorblind-toggle"
          role="switch"
          aria-checked={colorBlindMode}
          aria-label="Toggle color-blind mode"
          onClick={() => setColorBlindMode(!colorBlindMode)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 ${
            colorBlindMode ? "bg-[#4b5fff]" : "bg-dark-500"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              colorBlindMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label
          htmlFor="sound-toggle"
          className="cursor-pointer select-none text-sm font-medium text-gray-300"
        >
          Sound effects
        </label>
        <button
          id="sound-toggle"
          role="switch"
          aria-checked={soundEffects}
          aria-label="Toggle sound effects"
          onClick={() => setSoundEffects(!soundEffects)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 ${
            soundEffects ? "bg-[#4b5fff]" : "bg-dark-500"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              soundEffects ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label
          htmlFor="difficulty-toggle"
          className="cursor-pointer select-none text-sm font-medium text-gray-300"
        >
          Show difficulty badge
        </label>
        <button
          id="difficulty-toggle"
          role="switch"
          aria-checked={showDifficultyBadge}
          aria-label="Toggle difficulty badge"
          onClick={() => setShowDifficultyBadge(!showDifficultyBadge)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 ${
            showDifficultyBadge ? "bg-[#4b5fff]" : "bg-dark-500"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showDifficultyBadge ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <label
            htmlFor="hardmode-toggle"
            className="cursor-pointer select-none text-sm font-medium text-gray-300"
          >
            Hard mode
          </label>
          <span id="hardmode-description" className="text-xs text-gray-500">
            Revealed hints must be used in later guesses
          </span>
        </div>
        <button
          id="hardmode-toggle"
          role="switch"
          aria-checked={hardMode}
          aria-label="Toggle hard mode"
          aria-describedby="hardmode-description"
          onClick={() => setHardMode(!hardMode)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 ${
            hardMode ? "bg-[#4b5fff]" : "bg-dark-500"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              hardMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Data Management
        </span>
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="w-full rounded-md bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors text-left"
        >
          Reset Local Data
        </button>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-sm rounded-lg border border-white/10 bg-gray-900 p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Reset Local Data</h3>
            <p className="text-xs text-gray-300">
              Are you sure you want to clear local gameplay data?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded px-3 py-1 text-xs text-gray-400 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const COLOR_BLIND_SYMBOLS = {
  correct: "\u2713",
  present: "\u25B3",
  absent: "\u2717",
} as const;

type TileState = "correct" | "present" | "absent";

export function ColorBlindOverlay({ state }: { state: TileState }) {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center text-lg font-bold opacity-80"
      style={{ color: `var(--tile-${state})` }}
    >
      {COLOR_BLIND_SYMBOLS[state]}
    </span>
  );
}

export function AriaTileLabel({ state }: { state: TileState }) {
  return (
    <span className="sr-only">
      {state === "correct" ? "Correct letter in correct position" : state === "present" ? "Correct letter in wrong position" : "Letter not in word"}
    </span>
  );
}
