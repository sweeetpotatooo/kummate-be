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
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService, // UserService 주입
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AccessTokenPayload): Promise<User> {
    console.log('Refresh Token Payload:', payload); // 페이로드 로그 출력

    // payload.sub가 사용자 ID (user_id)라고 가정
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 토큰 무효화 확인
    const refreshToken = req?.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 없습니다.');
    }

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 무효화되었습니다.');
    }

    console.log('Validated User with Refresh Token:', user); // 검증된 사용자 로그 출력
    req.user = user; // User 엔티티 할당
    return user;
  }
}
