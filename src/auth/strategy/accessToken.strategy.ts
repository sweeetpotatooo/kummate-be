//src/auth/strategy/accessToken.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from '../auth.type';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('access_token') {}

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access_token',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      // request의 쿠키에서 refresh token을 가져옴
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      // 만료된 토큰은 거부
      ignoreExpiration: false,
      // validate 함수에 첫번째 인자에 request를 넘겨줌
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: AccessTokenPayload) {
    // request에 저장을 해놔야 Guard후에 controller 메서드에서 사용 가능
    console.log('Access Token Payload:', payload); // payload 로그 출력
    req.user = payload;
    return payload;
  }
}
