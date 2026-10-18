// Closes #1481: human-readable contract error messages.
export type ContractName = 'core_game' | 'rewards' | 'achievements';

export const ERROR_MESSAGES: Record<ContractName, Record<number, string>> = {
  core_game: {
    1: 'Game session not found.',
    2: 'This game has already finished.',
    3: 'Invalid guess. Please try another word.',
    4: 'You have no guesses left.',
  },
  rewards: {
    1: 'No rewards available to claim.',
    2: 'You are not authorized to do that.',
  },
  achievements: {
    1: 'Achievement not found.',
    2: 'Achievement already unlocked.',
  },
};

export function decodeError(contract: ContractName, code: number): string {
  return ERROR_MESSAGES[contract]?.[code] ?? `Unknown error (code ${code}).`;
}
