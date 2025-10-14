import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly accessTtl;
    private readonly refreshTtl;
    private readonly accessSecret;
    private readonly refreshSecret;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        id: string;
        email: string;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(res: Response): Promise<void>;
    private generateTokens;
    setRefreshTokenCookie(res: Response, token: string): void;
    clearRefreshTokenCookie(res: Response): void;
    private getRefreshTokenFromCookie;
    me(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        isAdmin: boolean;
        createdAt: Date;
    } | null>;
}
