import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/modules/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user?: User & { mustChangePassword?: boolean };
}

@Injectable()
export class ForcePasswordChangeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowPasswordChange = this.reflector.get<boolean>(
      'allowPasswordChange',
      context.getHandler(),
    );

    if (allowPasswordChange) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (user?.mustChangePassword) {
      throw new ForbiddenException(
        'You must change your password before accessing this resource',
      );
    }

    return true;
  }
}
