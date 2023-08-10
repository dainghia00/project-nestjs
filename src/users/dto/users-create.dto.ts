import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EPermissions } from 'src/auth/enums/auth.enum';

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

  @IsOptional()
  isSuperAdmin: boolean;

  @IsArray()
  @IsEnum(EPermissions, { each: true })
  @IsOptional()
  permissions: EPermissions[];
}
