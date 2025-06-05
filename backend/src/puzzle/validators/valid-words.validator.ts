import { ValidatorConstraint, type ValidatorConstraintInterface, type ValidationArguments } from "class-validator"
import { Injectable } from "@nestjs/common"

@ValidatorConstraint({ name: "areValidWordsValid", async: false })
@Injectable()
export class AreValidWordsValid implements ValidatorConstraintInterface {
  validate(validWords: string[], args: ValidationArguments): boolean {
    const object = args.object as any
    const grid = object.grid

    if (!validWords || !Array.isArray(validWords) || validWords.length < 4) {
      return false
    }

    // Check for duplicate words (case-insensitive)
    const upperWords = validWords.map((word) => word.toUpperCase())
    const uniqueWords = new Set(upperWords)
    if (uniqueWords.size !== validWords.length) {
      return false
    }

    // Check if all words can be formed from the grid
    if (grid) {
      return validWords.every((word) => this.canFormWordInGrid(word, grid))
    }

    return true
  }

  defaultMessage(args: ValidationArguments): string {
    return "Valid words must be unique, at least 4 words, and all must be formable from the grid"
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
