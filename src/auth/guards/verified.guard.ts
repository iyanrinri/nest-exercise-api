import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class VerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const user = request.user ? request.user : null;
    if (!user || (user?.role !== 'ADMIN' && !user.email_verified_at)) {
      throw new ForbiddenException('User email is not verified');
    }

    return true;
  }
}
