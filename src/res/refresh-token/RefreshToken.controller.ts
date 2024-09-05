import {
  Controller,
  Get,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RefreshTokenService } from './RefreshToken.service';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  // 리프레시 토큰 조회 엔드포인트
  @Get(':token')
  async findByToken(@Param('token') token: string) {
    const refreshToken = await this.refreshTokenService.findByToken(token);
    if (!refreshToken) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    return refreshToken;
  }

  // 리프레시 토큰 삭제 엔드포인트
  @Delete(':token')
  async removeRefreshToken(@Param('token') token: string) {
    await this.refreshTokenService.removeRefreshToken(token);
    return { message: 'Token deleted successfully' };
  }
}
