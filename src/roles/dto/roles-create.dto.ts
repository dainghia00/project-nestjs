import { IsEnum, IsNotEmpty } from 'class-validator';
import { ERoles } from 'src/auth/enums/auth.enum';

export class CreateRoleDto {
  @IsEnum(ERoles)
  @IsNotEmpty()
  roleName: ERoles;
}
