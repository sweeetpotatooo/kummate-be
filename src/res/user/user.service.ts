import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async getUserMainPage(): Promise<string> {
    return 'User Main Page';
  }
}
