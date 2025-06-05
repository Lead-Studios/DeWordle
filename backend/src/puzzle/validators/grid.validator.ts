import { ValidatorConstraint, type ValidatorConstraintInterface, type ValidationArguments } from "class-validator"
import { Injectable } from "@nestjs/common"

@ValidatorConstraint({ name: "isGridValid", async: false })
@Injectable()
export class IsGridValid implements ValidatorConstraintInterface {
  validate(grid: string[][], args: ValidationArguments): boolean {
    // Check if grid is an array
    if (!Array.isArray(grid)) {
      return false
    }

    // Check if grid has exactly 6 rows (as per your entity validation)
    if (grid.length !== 6) {
      return false
    }

    // Check if each row has exactly 8 columns and contains valid letters
    for (const row of grid) {
      if (!Array.isArray(row) || row.length !== 8) {
        return false
      }

      // Check if all elements in the row are valid single letters
      for (const cell of row) {
        if (typeof cell !== "string" || cell.length !== 1 || !cell.match(/^[A-Za-z]$/)) {
          return false
        }
      }
    }

    return true
  }

  defaultMessage(args: ValidationArguments): string {
    return "Grid must be a 6x8 array with single letters only"
  }
}
