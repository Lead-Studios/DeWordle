import { IsArray, IsDateString, IsNotEmpty, IsString, ArrayMinSize, ValidateNested, Validate } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsGridValid } from "../validators/grid.validator"
import { IsSpangramValid } from "../validators/spangram.validator"
import { IsDateUnique } from "../validators/date-unique.validator"
import { IsFutureDate } from "../validators/feature-date.validator"
import { AreValidWordsValid } from "../validators/valid-words.validator"

export class CreatePuzzleDto {
  @ApiProperty({
    example: "2024-01-15",
    description: "Date for the puzzle (YYYY-MM-DD)",
  })
  @IsDateString()
  @IsNotEmpty()
  @Type(() => Date)
  @Validate(IsDateUnique)
  @Validate(IsFutureDate, [7]) // Max 7 days in the future
  date: Date

  @ApiProperty({
    example: "Animals in the Wild",
    description: "Theme or hint for the puzzle",
  })
  @IsString()
  @IsNotEmpty()
  theme: string

  @ApiProperty({
    example: [
      ["T", "I", "G", "E", "R", "S", "H", "A"],
      ["L", "I", "O", "N", "M", "O", "N", "K"],
      ["E", "L", "E", "P", "H", "A", "N", "T"],
      ["P", "A", "N", "D", "A", "B", "E", "A"],
      ["R", "H", "I", "N", "O", "C", "E", "R"],
      ["O", "S", "Z", "E", "B", "R", "A", "S"],
    ],
    description: "6x8 grid of letters",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(6)
  @Validate(IsGridValid)
  grid: string[][]

  @ApiProperty({
    example: ["TIGER", "LION", "ELEPHANT", "PANDA", "RHINO", "ZEBRA", "MONKEY", "BEAR"],
    description: "List of all valid words in the puzzle",
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(4)
  @Validate(AreValidWordsValid)
  validWords: string[]

  @ApiProperty({
    example: "ELEPHANT",
    description: "The special connecting word (spangram)",
  })
  @IsString()
  @IsNotEmpty()
  @Validate(IsSpangramValid)
  spangram: string
}
