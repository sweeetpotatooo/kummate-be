import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from '../login/dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const { email, password } = loginDto;

    // 사용자 이메일로 데이터베이스에서 사용자 찾기
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log('User found:', user); // 쿼리 결과 로그

    // 사용자가 존재하고, 비밀번호가 일치하는지 확인
    if (user) {
      if (user.password === password) {
        console.log('Password match successful');
        return user;
      } else {
        console.log('Password does not match');
      }
    } else {
      console.log('User not found');
    }

    return null;
  }
  async findOne(user_id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { user_id },
    });
    return user || null;
  }
  async getUserMainPage(): Promise<string> {
    return 'User Main Page';
  }

  async findUserById(user_id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { user_id } });
    if (!user) {
      return null;
    }
    return user;
  }
  async updateUser(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }
}
