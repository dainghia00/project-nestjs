import { SetMetadata } from '@nestjs/common';

export const IS_SUPER_ADMIN = 'superadmin';
export const SuperAdmin = () => SetMetadata(IS_SUPER_ADMIN, true);
