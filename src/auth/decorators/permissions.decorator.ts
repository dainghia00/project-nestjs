import { SetMetadata } from '@nestjs/common';
import { EPermissions } from '../enums/auth.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: EPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
