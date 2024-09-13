//src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SignService } from './auth.service';
import { UserModule } from '../res/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './strategy/accessToken.strategy';
import { JwtRefreshTokenStrategy } from './strategy/refreshToken.strategy';
import { JwtAccessTokenGuard } from './guard/accessToken.guard';
import { JwtRefreshTokenGuard } from './guard/refreshToken.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/res/user/entities/user.entity';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]), // RefreshToken 엔티티 등록
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
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtAccessTokenGuard,
    JwtRefreshTokenGuard,
  ],
  exports: [SignService], // 서비스 export
})
export class AuthModule {}
