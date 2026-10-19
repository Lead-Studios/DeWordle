import { pushToast } from "@/store/useToastStore";
import { validateHardModeGuess, type EvaluatedGuess } from "./word-validation";

/**
 * Run before submitting a guess to the contract. When hard mode is on and the
 * guess ignores a revealed hint, shows an explanatory toast and returns false.
 */
export function guardHardModeGuess(
  guess: string,
  previousGuesses: EvaluatedGuess[],
  hardMode: boolean,
): boolean {
  if (!hardMode) return true;
  const result = validateHardModeGuess(guess, previousGuesses);
  if (!result.isValid && result.error) {
    pushToast(result.error, { tone: "warning" });
  }
  return result.isValid;
}
