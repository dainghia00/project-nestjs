import { SetMetadata } from '@nestjs/common';
import { ERoles } from '../enums/auth.enum';

export const IS_SUPER_ADMIN = 'superadmin';
export const IsSuperAdmin = (...roles: ERoles[]) =>
  SetMetadata(IS_SUPER_ADMIN, roles);
