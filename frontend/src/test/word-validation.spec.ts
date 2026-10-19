import { describe, it, expect } from 'vitest';
import {
  validateGuess,
  calculateLetterStatuses,
  isGameWon,
  validateHardModeGuess,
  type LetterStatus,
} from '../lib/word-validation';

describe('validateGuess', () => {
  const validWords = ['APPLE', 'GRAPE', 'MANGO', 'PEACH', 'BERRY'];

  it('accepts a valid 5-letter word', () => {
    const result = validateGuess('APPLE', validWords);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('rejects empty guess', () => {
    const result = validateGuess('', validWords);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Guess cannot be empty');
  });

  it('rejects guess with wrong length', () => {
    const result = validateGuess('CAT', validWords);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('exactly 5');
  });

  it('rejects guess with too many letters', () => {
    const result = validateGuess('ELEPHANT', validWords);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('exactly 5');
  });

  it('rejects guess with non-letter characters', () => {
    const result = validateGuess('12345', validWords);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('only letters');
  });

  it('rejects guess with special characters', () => {
    const result = validateGuess('A@#$%', validWords);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('only letters');
  });

  it('rejects guess not in valid word list', () => {
    const result = validateGuess('ZZZZZ', validWords);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('not a valid word');
  });

  it('accepts lowercase guess and normalizes', () => {
    const result = validateGuess('apple', validWords);
    expect(result.isValid).toBe(true);
  });

  it('strips surrounding whitespace before validation', () => {
    const result = validateGuess('  apple  ', validWords);
    expect(result.isValid).toBe(true);
  });
});

describe('calculateLetterStatuses', () => {
  it('marks all correct when guess matches target', () => {
    const statuses = calculateLetterStatuses('APPLE', 'APPLE');
    expect(statuses).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
  });

  it('marks absent when letter not in target', () => {
    const statuses = calculateLetterStatuses('XXXXX', 'APPLE');
    expect(statuses).toEqual(['absent', 'absent', 'absent', 'absent', 'absent']);
  });

  it('marks present when letter exists but wrong position', () => {
    const statuses = calculateLetterStatuses('PPPLE', 'APPLE');
    expect(statuses[0]).toBe('absent');
    expect(statuses[1]).toBe('correct');
    expect(statuses[2]).toBe('correct');
    expect(statuses[3]).toBe('correct');
    expect(statuses[4]).toBe('correct');
  });

  it('marks only one duplicate letter as present when target has one', () => {
    const statuses = calculateLetterStatuses('LLXXX', 'APPLE');
    expect(statuses).toEqual(['present', 'absent', 'absent', 'absent', 'absent']);
  });

  it('handles mixed statuses correctly', () => {
    const statuses = calculateLetterStatuses('PARSE', 'APPLE');
    expect(statuses[0]).toBe('present');
    expect(statuses[1]).toBe('present');
    expect(statuses[2]).toBe('absent');
    expect(statuses[3]).toBe('absent');
    expect(statuses[4]).toBe('correct');
  });

  it('is case insensitive', () => {
    const statuses = calculateLetterStatuses('apple', 'APPLE');
    expect(statuses).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
  });
});

describe('isGameWon', () => {
  it('returns true when all letters correct', () => {
    expect(isGameWon(['correct', 'correct', 'correct', 'correct', 'correct'])).toBe(true);
  });

  it('returns false when any letter not correct', () => {
    expect(isGameWon(['correct', 'present', 'correct', 'correct', 'correct'])).toBe(false);
  });

  it('returns false when all letters absent', () => {
    expect(isGameWon(['absent', 'absent', 'absent', 'absent', 'absent'])).toBe(false);
  });

  it('returns true for single-element correct array', () => {
    expect(isGameWon(['correct'])).toBe(true);
  });

  it('returns true for empty array', () => {
    expect(isGameWon([])).toBe(true);
  });
});

describe('validateHardModeGuess', () => {
  const history = [
    { guess: 'CRANE', statuses: ['absent', 'correct', 'present', 'absent', 'absent'] as LetterStatus[] },
  ];

  it('accepts a guess that reuses all revealed hints', () => {
    expect(validateHardModeGuess('BRASH', history).isValid).toBe(true);
  });

  it('rejects a guess that moves a correct-position letter', () => {
    const result = validateHardModeGuess('ABORT', history);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Hard mode: 2nd letter must be R');
  });

  it('rejects a guess missing a present letter', () => {
    const result = validateHardModeGuess('TRUST', history);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Hard mode: guess must contain A');
  });

  it('requires duplicate revealed letters to be repeated', () => {
    const dupHistory = [
      { guess: 'EERIE', statuses: ['present', 'present', 'absent', 'absent', 'absent'] as LetterStatus[] },
    ];
    expect(validateHardModeGuess('STEAL', dupHistory).error).toBe(
      'Hard mode: guess must contain E 2 times',
    );
    expect(validateHardModeGuess('SHEEP', dupHistory).isValid).toBe(true);
  });

  it('accepts anything with no history', () => {
    expect(validateHardModeGuess('ZZZZZ', []).isValid).toBe(true);
  });
});
