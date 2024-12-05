import { IsEnum, IsNotEmpty } from 'class-validator';
import { EPermissions } from 'src/auth/enums/auth.enum';

export class CreatePermissionDto {
  @IsEnum(EPermissions)
  @IsNotEmpty()
  permission: EPermissions;
}
