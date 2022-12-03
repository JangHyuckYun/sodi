import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';
import { User } from '../user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) return true;

    const { headers } = context.switchToHttp().getRequest();
    console.log('canActivate -> ', headers);

    if (headers.authorization?.startsWith('Bearer ')) {
      const token = headers.authorization.substring(7);
      const verified = await this.authService.verify(token);
      const user: User = await this.userService.findById(verified.id);
      console.log('canActivate -> ', token, verified, user);
      return requireRoles.some((role) => JSON.parse(user.role)?.includes(role));
    }

    return null;
  }
}
