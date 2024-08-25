import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    console.log('Sending verification code to:', email);
    const response = await axios.post('https://univcert.com/api/v1/certify', {
      email,
    });
    console.log('Verification code sent response:', response.data);
    if (response.status !== 200) {
      console.log('Failed to send verification code');
      throw new BadRequestException('인증번호 전송에 실패했습니다.');
    }
  }

  // 발송된 인증코드 확인
  async verifyCode(email: string, code: string): Promise<boolean> {
    console.log('Verifying code for email:', email, 'with code:', code);
    const response = await axios.post(
      'https://univcert.com/api/v1/certifycode',
      { email, code },
    );
    console.log('Verification code check response:', response.data);
    if (!response.data.success) {
      console.log('Failed to verify code');
      throw new BadRequestException('인증코드 검증에 실패했습니다.');
    }
    return true;
  }

  // 이메일 인증 상태 확인
  async checkEmailVerified(email: string): Promise<boolean> {
    console.log('Checking if email is verified:', email);
    const response = await axios.post('https://univcert.com/api/v1/status', {
      email,
    });
    console.log('Email verification status response:', response.data);
    return response.data.verified;
  }

  // 사용자 검증
  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const { email, password } = loginDto;
    console.log('Validating user with email:', email);
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user) {
      console.log('User found:', user);
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', passwordMatch);
      if (passwordMatch) {
        return user;
      }
    }
    console.log('Invalid user credentials');
    return null;
  }

  // 사용자 생성
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    console.log('Creating user with data:', rest);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    const user = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
    });

    console.log('Saving user:', user);
    return this.usersRepository.save(user);
  }

  // 사용자 업데이트
  async updateUser(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    console.log('Updating user with ID:', user_id);
    const user = await this.usersRepository.findOneBy({ user_id });

    if (!user) {
      console.log('User not found for ID:', user_id);
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      console.log('Updating password for user ID:', user_id);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    console.log('Updated user data:', user);
    return this.usersRepository.save(user);
  }

  async findOne(user_id: number): Promise<User | null> {
    console.log('Finding user with ID:', user_id);
    const user = await this.usersRepository.findOne({
      where: { user_id },
    });
    console.log('User found:', user);
    return user || null;
  }

  async getUserMainPage(): Promise<string> {
    console.log('Getting user main page');
    return 'User Main Page';
  }

  async findUserById(user_id: number): Promise<User | null> {
    console.log('Finding user by ID:', user_id);
    const user = await this.usersRepository.findOne({ where: { user_id } });
    console.log('User found by ID:', user);
    return user || null;
  }
}
