import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly accessTtl = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  private readonly refreshTtl = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  private readonly accessSecret = process.env.JWT_ACCESS_SECRET || 'change';
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'change-refresh';

  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(dto: { name: string; email: string; password: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({ data: { name: dto.name, email: dto.email, passwordHash } });
    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.generateTokens(user.id, !!user.isAdmin);
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12);
    await this.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
    return tokens;
  }

  async refresh(res: Response) {
    const token = this.getRefreshTokenFromCookie(res);
    if (!token) throw new UnauthorizedException('No refresh token');
    const payload = await this.jwt.verifyAsync(token, { secret: this.refreshSecret });
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Invalid refresh token');
    const match = await bcrypt.compare(token, user.refreshTokenHash);
    if (!match) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.generateTokens(user.id, !!user.isAdmin);
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12);
    await this.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
    return tokens;
  }

  async logout(res: Response) {
    const token = this.getRefreshTokenFromCookie(res);
    if (token) {
      try {
        const payload = await this.jwt.verifyAsync(token, { secret: this.refreshSecret });
        await this.prisma.user.update({ where: { id: payload.sub }, data: { refreshTokenHash: null } });
      } catch {}
    }
    this.clearRefreshTokenCookie(res);
  }

  private async generateTokens(userId: string, isAdmin: boolean) {
    const accessToken = await this.jwt.signAsync({ sub: userId, isAdmin }, {
      expiresIn: this.accessTtl,
      secret: this.accessSecret,
    });
    const refreshToken = await this.jwt.signAsync({ sub: userId }, {
      expiresIn: this.refreshTtl,
      secret: this.refreshSecret,
    });
    return { accessToken, refreshToken };
  }

  setRefreshTokenCookie(res: Response, token: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN || 'localhost',
      path: '/',
    });
  }

  clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refreshToken', { path: '/' });
  }

  private getRefreshTokenFromCookie(res: Response): string | null {
    // In Nest, cookies are on the request; here we pass Response with req attached
    const req: any = (res as any).req;
    return req?.cookies?.refreshToken || null;
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, isAdmin: true, createdAt: true },
    });
    return user;
  }
}
