// src/auth/strategy/accessToken.strategy.ts

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from '../auth.type';
import { UserService } from 'src/res/user/user.service';
import { User } from 'src/res/user/entities/user.entity';
@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access_token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService, // UserService 주입
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AccessTokenPayload): Promise<User> {
    console.log('Access Token Payload:', payload); // 페이로드 로그 출력

    // payload.sub가 사용자 ID (user_id)라고 가정
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 토큰 무효화 확인
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('인증 헤더가 없습니다.');
    }

    const token = authHeader.split(' ')[1];
    if (user.accessToken !== token) {
      throw new UnauthorizedException('토큰이 무효화되었습니다.');
    }

    console.log('Validated User:', user); // 검증된 사용자 로그 출력
    req.user = user; // User 엔티티 할당
    return user;
  }
}
