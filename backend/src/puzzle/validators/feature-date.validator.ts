import { ValidatorConstraint, type ValidatorConstraintInterface, type ValidationArguments } from "class-validator"
import { Injectable } from "@nestjs/common"

@ValidatorConstraint({ name: "isFutureDate", async: false })
@Injectable()
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments): boolean {
    const maxDaysAhead = args.constraints[0] || 7 // Default to 7 days
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const inputDate = new Date(date)
    inputDate.setHours(0, 0, 0, 0)

    const maxDate = new Date()
    maxDate.setDate(today.getDate() + maxDaysAhead)
    maxDate.setHours(23, 59, 59, 999)

    // Allow today and future dates up to maxDaysAhead
    return inputDate >= today && inputDate <= maxDate
  }

  defaultMessage(args: ValidationArguments): string {
    const maxDaysAhead = args.constraints[0] || 7
    return `Date must be today or up to ${maxDaysAhead} days in the future`
  }
}
