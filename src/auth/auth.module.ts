//src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SignService } from './auth.service';
import { UserModule } from '../res/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './strategy/accessToken.strategy';
import { JwtRefreshTokenStrategy } from './strategy/refreshToken.strategy';
import { JwtAccessTokenGuard } from './guard/accessToken.guard';
import { JwtRefreshTokenGuard } from '../res/refresh-token/guard/refreshToken.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '../res/refresh-token/entities/RefreshToken.entity'; // RefreshToken 엔티티
import { RefreshTokenService } from '../res/refresh-token/RefreshToken.service'; // 새로 만든 서비스
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([RefreshToken]), // RefreshToken 엔티티 등록
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    SignService,
    RefreshTokenService, // 서비스 주입
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtAccessTokenGuard,
    JwtRefreshTokenGuard,
  ],
  exports: [SignService, RefreshTokenService], // 서비스 export
})
export class AuthModule {}
