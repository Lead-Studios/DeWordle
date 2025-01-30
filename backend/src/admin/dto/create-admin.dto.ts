import { IsBoolean, IsEmail, IsString } from 'class-validator';
export class CreateAdminDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isSuperAdmin: boolean;
}
