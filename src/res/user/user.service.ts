import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from '../login/dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const { username, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    // 여기서는 간단히 비밀번호를 비교하지만, 실제로는 해시 비밀번호를 사용해야 합니다.
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async getUserMainPage(): Promise<string> {
    return 'User Main Page';
  }
}
