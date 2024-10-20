import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SignService } from './auth.service';
import { SignInRequestDto, SignUpRequestDto } from './dto/auth.dto';
import { LogOutResultDto } from './dto/auth.dto';
import { JwtAccessTokenGuard } from './guard/accessToken.guard';
import { ApiOperation } from '@nestjs/swagger';
import { CustomRequest } from './interfaces/jwtpayload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly signService: SignService) {}

  // 회원가입 엔드포인트
  @Post('signup')
  async signUp(@Body() signUpRequestDto: SignUpRequestDto): Promise<void> {
    return this.signService.signUp(signUpRequestDto);
  }

  // 로그인 엔드포인트
  @Post('signin')
  async signIn(@Body() signInRequestDto: SignInRequestDto) {
    return this.signService.signIn(signInRequestDto);
  }

  // 프로필 정보 확인 (JWT가 필요한 요청)
  @UseGuards(JwtAccessTokenGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return req.user;
  }

  @ApiOperation({
    summary: '로그아웃',
    description: '로그인된 사용자를 로그아웃 처리합니다.',
  })
  @Post('logout')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: CustomRequest): Promise<LogOutResultDto> {
    console.log('User info from token:', req.user); // 로그로 확인
    const userId = req.user.user_id; // 올바른 참조
    const result = await this.signService.logout(userId);
    console.log(`result: ${result}`);
    return result;
  }
}
