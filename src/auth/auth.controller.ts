import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../res/login/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log(`controller_logindto: ${JSON.stringify(loginDto)}`);
    const token = await this.authService.login(loginDto);
    console.log(`ttoken: ${token}`);
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { token };
  }
}
