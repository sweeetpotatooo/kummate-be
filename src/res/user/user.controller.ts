import {
  Body,
  Post,
  Controller,
  Get,
  Put, // PUT 메서드 추가
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // UpdateUserDto 가져오기

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

  // 사용자 정보 업데이트 엔드포인트 추가
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }
}
