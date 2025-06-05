import { ValidatorConstraint, type ValidatorConstraintInterface, type ValidationArguments } from "class-validator"
import { Injectable } from "@nestjs/common"

@ValidatorConstraint({ name: "isSpangramValid", async: false })
@Injectable()
export class IsSpangramValid implements ValidatorConstraintInterface {
  validate(spangram: string, args: ValidationArguments): boolean {
    const object = args.object as any
    const validWords = object.validWords
    const grid = object.grid

    // Check if spangram is in validWords (case-insensitive)
    if (!validWords || !validWords.map((w: string) => w.toUpperCase()).includes(spangram.toUpperCase())) {
      return false
    }

    // Check if spangram can be found in the grid
    if (!grid || !this.canFormWordInGrid(spangram, grid)) {
      return false
    }

    // Spangram should be one of the longer words (at least 4 letters)
    if (spangram.length < 4) {
      return false
    }

    return true
  }

  defaultMessage(args: ValidationArguments): string {
    return "Spangram must be included in validWords, present in the grid, and be at least 4 letters long"
  }

  private canFormWordInGrid(word: string, grid: string[][]): boolean {
    const upperWord = word.toUpperCase()
    const upperGrid = grid.map((row) => row.map((cell) => cell.toUpperCase()))

    // Create a frequency map of letters in the grid
    const gridLetterCount = new Map<string, number>()
    upperGrid.flat().forEach((letter) => {
      gridLetterCount.set(letter, (gridLetterCount.get(letter) || 0) + 1)
    })

    // Create a frequency map of letters in the word
    const wordLetterCount = new Map<string, number>()
    upperWord.split("").forEach((letter) => {
      wordLetterCount.set(letter, (wordLetterCount.get(letter) || 0) + 1)
    })

    // Check if grid has enough of each letter needed for the word
    for (const [letter, count] of wordLetterCount) {
      if ((gridLetterCount.get(letter) || 0) < count) {
        return false
      }
    }

    return true
  }
}
