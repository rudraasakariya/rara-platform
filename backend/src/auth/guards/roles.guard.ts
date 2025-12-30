import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/roles/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { MessageCode, Messages } from 'src/common/messages';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles from the @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Check method-level decorator first
      context.getClass(),    // Then check class-level decorator
    ]);

    // If no roles are specified, allow all authenticated users
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get the user from the request (set by JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If user doesn't exist (shouldn't happen if JwtAuthGuard ran first)
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user's role is in the required roles
    const hasRole = requiredRoles.includes(user.role as Role);

    if (!hasRole) {
      throw new ForbiddenException(
        Messages[MessageCode.INSUFFICIENT_PERMISSIONS]
      );
    }

    return true;
  }
}