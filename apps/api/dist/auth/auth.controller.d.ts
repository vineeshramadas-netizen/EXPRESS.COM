import { AuthService } from './auth.service';
import { Response } from 'express';
declare class RegisterDto {
    name: string;
    email: string;
    password: string;
}
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        accessToken: string;
    }>;
    refresh(res: Response): Promise<{
        accessToken: string;
    }>;
    logout(res: Response): Promise<{
        success: boolean;
    }>;
    me(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        isAdmin: boolean;
        createdAt: Date;
    } | null>;
}
export {};
