import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { Roles } from 'src/auth/roles.constants';

export const ROLES_KEY = 'roles';
export const HasRoles = (...roles: Roles[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
