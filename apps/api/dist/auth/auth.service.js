"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.accessTtl = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
        this.refreshTtl = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
        this.accessSecret = process.env.JWT_ACCESS_SECRET || 'change';
        this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'change-refresh';
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.BadRequestException('Email already registered');
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({ data: { name: dto.name, email: dto.email, passwordHash } });
        return { id: user.id, email: user.email };
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const tokens = await this.generateTokens(user.id, !!user.isAdmin);
        const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12);
        await this.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
        return tokens;
    }
    async refresh(res) {
        const token = this.getRefreshTokenFromCookie(res);
        if (!token)
            throw new common_1.UnauthorizedException('No refresh token');
        const payload = await this.jwt.verifyAsync(token, { secret: this.refreshSecret });
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user || !user.refreshTokenHash)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        const match = await bcrypt.compare(token, user.refreshTokenHash);
        if (!match)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        const tokens = await this.generateTokens(user.id, !!user.isAdmin);
        const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 12);
        await this.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
        return tokens;
    }
    async logout(res) {
        const token = this.getRefreshTokenFromCookie(res);
        if (token) {
            try {
                const payload = await this.jwt.verifyAsync(token, { secret: this.refreshSecret });
                await this.prisma.user.update({ where: { id: payload.sub }, data: { refreshTokenHash: null } });
            }
            catch { }
        }
        this.clearRefreshTokenCookie(res);
    }
    async generateTokens(userId, isAdmin) {
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
    setRefreshTokenCookie(res, token) {
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
    clearRefreshTokenCookie(res) {
        res.clearCookie('refreshToken', { path: '/' });
    }
    getRefreshTokenFromCookie(res) {
        // In Nest, cookies are on the request; here we pass Response with req attached
        const req = res.req;
        return req?.cookies?.refreshToken || null;
    }
    async me(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, isAdmin: true, createdAt: true },
        });
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
