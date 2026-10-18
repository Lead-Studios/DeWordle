// Closes #1477: typed event parser for DeWordle contract events.
export interface RawEvent { topics: string[]; data: Record<string, unknown> }

export interface SessionCreatedEvent { type: 'session_created'; sessionId: string; player: string }
export interface GuessSubmittedEvent { type: 'guess_submitted'; sessionId: string; guess: string }
export interface SessionFinalizedEvent { type: 'session_finalized'; sessionId: string; won: boolean }
export interface UnknownEvent { type: 'unknown'; raw: RawEvent }

export type DeWordleEvent = SessionCreatedEvent | GuessSubmittedEvent | SessionFinalizedEvent | UnknownEvent;

export const isSessionCreatedEvent = (e: DeWordleEvent): e is SessionCreatedEvent => e.type === 'session_created';
export const isGuessSubmittedEvent = (e: DeWordleEvent): e is GuessSubmittedEvent => e.type === 'guess_submitted';
export const isSessionFinalizedEvent = (e: DeWordleEvent): e is SessionFinalizedEvent => e.type === 'session_finalized';

export function parseEvent(raw: RawEvent): DeWordleEvent {
  const d = raw.data;
  switch (raw.topics[0]) {
    case 'session_created':
      return { type: 'session_created', sessionId: String(d.sessionId), player: String(d.player) };
    case 'guess_submitted':
      return { type: 'guess_submitted', sessionId: String(d.sessionId), guess: String(d.guess) };
    case 'session_finalized':
      return { type: 'session_finalized', sessionId: String(d.sessionId), won: Boolean(d.won) };
    default:
      return { type: 'unknown', raw };
  }
}
