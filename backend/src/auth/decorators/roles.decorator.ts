import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/roles/roles.enum';

/**
 * Metadata key for storing roles
 * This is what the guard will look for
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which roles can access a route
 * 
 * Usage:
 * @Roles(Role.ADMIN, Role.SUPER_ADMIN)
 * @Get('/admin/students')
 * 
 * @param roles - One or more roles that can access this route
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);