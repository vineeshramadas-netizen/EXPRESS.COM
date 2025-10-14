import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class RolesGuard implements CanActivate {
    private readonly requiredAdmin;
    constructor(requiredAdmin?: boolean);
    canActivate(context: ExecutionContext): boolean;
}
