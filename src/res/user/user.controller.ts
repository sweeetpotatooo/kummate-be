import {
  Body,
  Post,
  Controller,
  Get,
  Put,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('main')
  async getUserMainPage(): Promise<string> {
    return await this.userService.getUserMainPage();
  }

  @Get('all')
  async findAll() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Post('signup')
  async postJoin(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  // 이메일 인증 요청 엔드포인트
  @Post('send-verification')
  async sendVerificationCode(@Body('email') email: string) {
    await this.userService.sendVerificationCode(email);
    return { message: 'Verification code sent' };
  }

  // 인증 코드 검증 엔드포인트
  @Post('verify-code')
  async verifyCode(@Body('email') email: string, @Body('code') code: string) {
    const verified = await this.userService.verifyCode(email, code);
    if (verified) {
      return { message: 'Email verified successfully' };
    } else {
      throw new HttpException(
        'Invalid verification code',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 이메일 인증 상태 확인 엔드포인트
  @Post('check-verification-status')
  async checkVerificationStatus(@Body('email') email: string) {
    const verified = await this.userService.checkEmailVerified(email);
    return { verified };
  }
}
