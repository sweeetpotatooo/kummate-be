import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../res/user/user.service';
import { LoginDto } from '../res/login/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    console.log(`loginDto:${loginDto.user_id}`);
    const user = await this.userService.validateUser(loginDto);
    console.log(`user: ${user}`);
    if (!user) {
      throw new UnauthorizedException('잘못된 자격증명');
    }

    // JWT 토큰을 생성하여 반환합니다.
    const payload = { username: user.email, sub: user.nickname };
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('잘못된 토큰');
    }
  }
}
