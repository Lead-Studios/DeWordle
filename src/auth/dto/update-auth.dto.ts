import { PartialType } from '@nestjs/mapped-types';
import { SignInDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(SignInDto) {}
