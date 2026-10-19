"use client";

import { useCallback, useId, useState } from "react";

/** sessionStorage key prefix used to cache definitions per word. */
export const DEFINITION_CACHE_PREFIX = "dewordle:definition:";

export interface WordDefinition {
  word: string;
  definition: string;
  partOfSpeech: string | null;
  example: string | null;
  phonetic: string | null;
}

/** Read a cached definition; malformed or unavailable storage is ignored. */
function readCachedDefinition(word: string): WordDefinition | null {
  try {
    const raw = window.sessionStorage.getItem(
      `${DEFINITION_CACHE_PREFIX}${word}`,
    );
    if (!raw) return null;
    return JSON.parse(raw) as WordDefinition;
  } catch {
    return null;
  }
}

/** Cache a definition for the rest of the browsing session (best-effort). */
function cacheDefinition(word: string, payload: WordDefinition): void {
  try {
    window.sessionStorage.setItem(
      `${DEFINITION_CACHE_PREFIX}${word}`,
      JSON.stringify(payload),
    );
  } catch {
    // Caching is best-effort only.
  }
}

function DefinitionSpinner() {
  return (
    <span
      role="status"
      aria-label="Loading definition"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
    />
  );
}

export function WordDefinitionTooltip({ word }: { word: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [definition, setDefinition] = useState<string | null>(null);
  const tooltipId = useId();

  const loadDefinition = useCallback(async () => {
    const cached = readCachedDefinition(word);
    if (cached) {
      setDefinition(cached.definition);
      setStatus("ready");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(
        `/api/definition?word=${encodeURIComponent(word)}`,
      );
      if (!response.ok) {
        setStatus("error");
        return;
      }

      const payload = (await response.json()) as WordDefinition;
      if (!payload.definition) {
        setStatus("error");
        return;
      }

      setDefinition(payload.definition);
      setStatus("ready");
      cacheDefinition(word, payload);
    } catch {
      setStatus("error");
    }
  }, [word]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    if (status === "idle") {
      void loadDefinition();
    }
  }, [loadDefinition, status]);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={`Show definition of ${word.toUpperCase()}`}
        aria-describedby={open ? tooltipId : undefined}
        onFocus={handleOpen}
        onMouseEnter={handleOpen}
        onBlur={handleClose}
        onMouseLeave={handleClose}
        onClick={handleOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape") handleClose();
        }}
        className="rounded text-2xl font-bold tracking-widest underline decoration-purple-400/60 decoration-dotted underline-offset-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        {word.toUpperCase()}
      </button>

      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-white/15 bg-[#12072b] p-3 text-left text-xs font-normal normal-case tracking-normal text-white shadow-2xl"
        >
          {status === "ready" && definition ? (
            <span>{definition}</span>
          ) : status === "error" ? (
            <span className="text-gray-300">Definition unavailable</span>
          ) : (
            <span className="flex items-center gap-2 text-gray-300">
              <DefinitionSpinner />
              Loading definition…
            </span>
          )}
        </span>
      )}
    </span>
  );
}
