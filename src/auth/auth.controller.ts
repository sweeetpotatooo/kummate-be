/*
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { Response } from 'express';
import { JwtRefreshTokenGuard } from './guard/refreshToken.guard';
import { JwtAccessTokenGuard } from './guard/accessToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // access token 검증 메서드
  @UseGuards(JwtAccessTokenGuard)
  @Get('test')
  test() {
    return 'ahha';
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // access, refresh token 발급
    const tokenData = await this.authService.login(loginDto);

    // 쿠키에 토큰 저장
    res.setHeader('Authorization', 'Bearer ' + Object.values(tokenData));
    res.cookie('access_token', tokenData.atk, { httpOnly: true });
    res.cookie('refresh_token', tokenData.rtk, { httpOnly: true });

    return tokenData;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId: string = req.user.userId;
    const rtk = req.cookies.rtk;

    // 새로운 access token 발급
    const tokenData = await this.authService.refresh(userId, rtk);

    // 쿠키의 access token 교체
    res.setHeader('Authorization', 'Bearer ' + tokenData.atk);
    res.cookie('access_token', tokenData.atk, { httpOnly: true });

    return tokenData;
  }

  @UseGuards(JwtAccessTokenGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    await this.authService.logout(req.user.userId);

    // 쿠키 토큰 삭제
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.send('logout complete');
  }
}
*/
import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { SignService } from './auth.service';
import { SignInRequestDto, SignUpRequestDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly signService: SignService) {}

  // 회원가입 엔드포인트
  @Post('signup')
  async signUp(@Body() signUpRequestDto: SignUpRequestDto): Promise<void> {
    // SignService에서 회원가입 처리
    return this.signService.signUp(signUpRequestDto);
  }

  // 로그인 엔드포인트
  @Post('signin')
  async signIn(@Body() signInRequestDto: SignInRequestDto) {
    // SignService에서 로그인 처리 및 토큰 반환
    return this.signService.signIn(signInRequestDto);
  }

  // JWT가 필요한 요청을 처리하는 엔드포인트
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    // JWT가 유효하면, 유저 정보 반환 (req.user에서 가져올 수 있음)
    return req.user;
  }
}
