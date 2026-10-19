import { NextResponse } from "next/server";

/**
 * Server-side proxy for the Free Dictionary API (https://dictionaryapi.dev/).
 *
 * Proxying keeps the browser request same-origin (so the strict CSP
 * `connect-src` policy does not need an exception) and lets the route cache
 * upstream lookups for a day.
 */
const DICTIONARY_API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";

interface DictionaryApiDefinition {
  definition?: string;
  example?: string;
}

interface DictionaryApiMeaning {
  partOfSpeech?: string;
  definitions?: DictionaryApiDefinition[];
}

interface DictionaryApiEntry {
  word?: string;
  phonetic?: string;
  phonetics?: Array<{ text?: string }>;
  meanings?: DictionaryApiMeaning[];
}

export interface WordDefinitionPayload {
  word: string;
  definition: string;
  partOfSpeech: string | null;
  example: string | null;
  phonetic: string | null;
}

export async function GET(request: Request) {
  const word = (new URL(request.url).searchParams.get("word") ?? "")
    .trim()
    .toLowerCase();

  if (!/^[a-z]{2,32}$/.test(word)) {
    return NextResponse.json(
      { message: "A valid word is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${DICTIONARY_API_BASE}/${encodeURIComponent(word)}`,
      {
        headers: { accept: "application/json" },
        // A word's definition is static, so reuse the cached upstream response.
        cache: "force-cache",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Definition unavailable" },
        { status: 404 },
      );
    }

    const entries = (await response.json()) as DictionaryApiEntry[];
    const meaning = entries[0]?.meanings?.[0];
    const firstDefinition = meaning?.definitions?.[0];

    if (!firstDefinition?.definition) {
      return NextResponse.json(
        { message: "Definition unavailable" },
        { status: 404 },
      );
    }

    const payload: WordDefinitionPayload = {
      word: entries[0]?.word ?? word,
      definition: firstDefinition.definition,
      partOfSpeech: meaning?.partOfSpeech ?? null,
      example: firstDefinition.example ?? null,
      phonetic: entries[0]?.phonetic ?? entries[0]?.phonetics?.[0]?.text ?? null,
    };

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { message: "Definition unavailable" },
      { status: 502 },
    );
  }
}
