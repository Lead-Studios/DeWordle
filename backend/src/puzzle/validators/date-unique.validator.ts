import { ValidatorConstraint, type ValidatorConstraintInterface, type ValidationArguments } from "class-validator"
import { Injectable } from "@nestjs/common"
import { PuzzleService } from "../puzzle.service"

@ValidatorConstraint({ name: "isDateUnique", async: true })
@Injectable()
export class IsDateUnique implements ValidatorConstraintInterface {
  constructor(private readonly puzzleService: PuzzleService) {}

  async validate(date: Date, args: ValidationArguments): Promise<boolean> {
    try {
      const existingPuzzle = await this.puzzleService.getPuzzleByDate(date)
      return !existingPuzzle // Return true if no puzzle exists for this date
    } catch (error) {
      // If getPuzzleByDate throws NotFoundException, it means no puzzle exists
      return true
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return "A puzzle already exists for this date"
  }
}
