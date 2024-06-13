import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUserMainPage(): Promise<string> {
    const res = await this.userService.getUserMainPage();

    return res;
  }
}
