import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from '../login/dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 이메일로 인증번호 전송
  async sendVerificationCode(email: string): Promise<void> {
    const response = await axios.post('https://univcert.com/api/v1/certify', {
      email,
    });
    if (response.status !== 200) {
      throw new BadRequestException('인증번호 전송에 실패했습니다.');
    }
  }

  // 발송된 인증코드 확인
  async verifyCode(email: string, code: string): Promise<boolean> {
    const response = await axios.post(
      'https://univcert.com/api/v1/certifycode',
      { email, code },
    );
    if (!response.data.success) {
      throw new BadRequestException('인증코드 검증에 실패했습니다.');
    }
    return true;
  }

  // 이메일 인증 상태 확인
  async checkEmailVerified(email: string): Promise<boolean> {
    const response = await axios.post('https://univcert.com/api/v1/status', {
      email,
    });
    return response.data.verified;
  }

  // 사용자 검증
  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      return null;
    }
  }

  // 사용자 생성
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  // 사용자 업데이트
  async updateUser(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

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
