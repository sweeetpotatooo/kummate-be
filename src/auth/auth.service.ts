// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../res/user/user.service'; // 경로 수정
import { LoginDto } from '../res/login/dto/login.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.usersService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { username: user.nickname, sub: user.user_id };
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.usersService.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
