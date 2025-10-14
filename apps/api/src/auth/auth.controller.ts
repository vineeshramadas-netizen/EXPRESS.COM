import { Body, Controller, Get, Post, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

class RegisterDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;
}

class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @Throttle(10, 60)
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @Throttle(10, 60)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.auth.login(dto.email, dto.password);
    this.auth.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('refresh')
  @Throttle(20, 60)
  async refresh(@Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.auth.refresh(res);
    this.auth.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.auth.logout(res);
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return this.auth.me(req.user.userId);
  }
}
