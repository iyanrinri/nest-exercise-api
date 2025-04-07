import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/role.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest<Request>();
    const user = request.user ? request.user : null;
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const role = user.role ? user.role : 'USER';
    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException('You do not have permission (roles)');
    }

    return true;
  }
}
