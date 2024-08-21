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
  @Get()
  async getUserMainPage(): Promise<string> {
    const res = await this.userService.getUserMainPage();

    return res;
  }
  @Get()
  async findAll() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
  @Post()
  async postJoin(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
