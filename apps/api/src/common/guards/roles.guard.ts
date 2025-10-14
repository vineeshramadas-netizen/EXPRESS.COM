import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly requiredAdmin: boolean = false) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user as { isAdmin?: boolean } | undefined;
    if (!this.requiredAdmin) return !!user;
    return !!user?.isAdmin;
  }
}
