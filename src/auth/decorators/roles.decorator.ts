import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../prisma/schema/__generated__';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
