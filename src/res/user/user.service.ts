import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from '../login/dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 사용자 검증 메서드
  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const { email, password } = loginDto;

    // 사용자 이메일로 데이터베이스에서 사용자 찾기
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log('User found:', user); // 쿼리 결과 로그

    // 사용자가 존재하고, 비밀번호가 일치하는지 확인
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('Password match successful');
      return user;
    } else {
      console.log('Invalid credentials');
      return null;
    }
  }

  // 사용자 생성 또는 업데이트 시 비밀번호 해시화 처리
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async updateUser(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 비밀번호가 업데이트되었는지 확인하고, 해시화
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
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
}
