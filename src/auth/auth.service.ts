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
    console.log(`Login DTO: ${JSON.stringify(loginDto)}`);
    const user = await this.userService.validateUser(loginDto);
    console.log(`User after validateUser: ${JSON.stringify(user)}`);
    if (!user) {
      console.log('User not found or password mismatch');
      throw new UnauthorizedException('Invalid credentials');
    }

    // JWT 토큰을 생성하여 반환합니다.
    const payload = { username: user.email, sub: user.username };
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
