import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { PrimaryColumn } from 'typeorm';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @PrimaryColumn()
    @IsNotEmpty()
    @IsInt()
    id:number
}
