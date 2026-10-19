export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const WORD_LENGTH = 5;
const VALID_LETTERS = /^[A-Z]+$/;

export function validateGuess(guess: string, validWords: string[]): ValidationResult {
  const normalizedGuess = guess.trim().toUpperCase();

  if (!normalizedGuess) {
    return { isValid: false, error: 'Guess cannot be empty' };
  }

  if (normalizedGuess.length !== WORD_LENGTH) {
    return {
      isValid: false,
      error: `Guess must be exactly ${WORD_LENGTH} letters. Got ${normalizedGuess.length}.`,
    };
  }

  if (!VALID_LETTERS.test(normalizedGuess)) {
    return { isValid: false, error: 'Guess must contain only letters A-Z' };
  }

  const normalizedWords = new Set(validWords.map((word) => word.trim().toUpperCase()));
  if (!normalizedWords.has(normalizedGuess)) {
    return { isValid: false, error: `"${normalizedGuess}" is not a valid word` };
  }

  return { isValid: true };
}

export function calculateLetterStatuses(
  guess: string,
  targetWord: string
): ('correct' | 'present' | 'absent')[] {
  const result: ('correct' | 'present' | 'absent')[] = new Array(guess.length).fill('absent');
  const targetLetters = targetWord.toUpperCase().split('');
  const guessLetters = guess.toUpperCase().split('');
  const used = new Array(targetLetters.length).fill(false);

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  for (let i = 0; i < guessLetters.length; i++) {
    if (result[i] === 'correct') continue;

    for (let j = 0; j < targetLetters.length; j++) {
      if (!used[j] && guessLetters[i] === targetLetters[j]) {
        result[i] = 'present';
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

export function isGameWon(statuses: ('correct' | 'present' | 'absent')[]): boolean {
  return statuses.every((s) => s === 'correct');
}

export type LetterStatus = 'correct' | 'present' | 'absent';

export interface EvaluatedGuess {
  guess: string;
  statuses: LetterStatus[];
}

function ordinal(n: number): string {
  const suffix = n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
  return `${n}${suffix}`;
}

/**
 * Hard mode (#1426): a guess must keep every letter previously confirmed in its
 * correct position, and must include every letter previously revealed as
 * present (respecting how many times it was revealed in a single guess).
 */
export function validateHardModeGuess(
  guess: string,
  previousGuesses: EvaluatedGuess[],
): ValidationResult {
  const letters = guess.trim().toUpperCase().split('');

  for (const { guess: prior, statuses } of previousGuesses) {
    const priorLetters = prior.toUpperCase().split('');
    for (let i = 0; i < statuses.length; i++) {
      if (statuses[i] === 'correct' && letters[i] !== priorLetters[i]) {
        return {
          isValid: false,
          error: `Hard mode: ${ordinal(i + 1)} letter must be ${priorLetters[i]}`,
        };
      }
    }
  }

  const required = new Map<string, number>();
  for (const { guess: prior, statuses } of previousGuesses) {
    const counts = new Map<string, number>();
    prior.toUpperCase().split('').forEach((letter, i) => {
      if (statuses[i] === 'correct' || statuses[i] === 'present') {
        counts.set(letter, (counts.get(letter) ?? 0) + 1);
      }
    });
    for (const [letter, count] of counts) {
      required.set(letter, Math.max(required.get(letter) ?? 0, count));
    }
  }

  for (const [letter, count] of required) {
    const used = letters.filter((l) => l === letter).length;
    if (used < count) {
      return {
        isValid: false,
        error:
          count > 1
            ? `Hard mode: guess must contain ${letter} ${count} times`
            : `Hard mode: guess must contain ${letter}`,
      };
    }
  }

  return { isValid: true };
}
