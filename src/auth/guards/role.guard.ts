import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from '../../users/schemas/user.schema';

const RoleGuard = (roles: Role[]) => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return roles.includes(user.role);
    }
  }
  return RoleGuardMixin;
};

export default RoleGuard;
