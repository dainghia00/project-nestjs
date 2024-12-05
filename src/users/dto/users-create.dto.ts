import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EPermissions, ERoles } from 'src/auth/enums/auth.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ERoles)
  @IsNotEmpty()
  role: ERoles;
}
