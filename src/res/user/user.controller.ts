import {
  Body,
  Post,
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 기본 사용자 메인 페이지 반환
  @Get('main')
  async getUserMainPage(): Promise<string> {
    const res = await this.userService.getUserMainPage();
    return res;
  }

  // 모든 사용자 정보 가져오기 시도, 금지 예외 발생
  @Get('all')
  async findAll() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  // 회원가입 엔드포인트
  @Post('signup')
  async postJoin(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
