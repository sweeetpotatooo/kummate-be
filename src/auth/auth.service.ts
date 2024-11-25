import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../res/user/entities/user.entity';
import {
  SignUpRequestDto,
  SignInRequestDto,
  SignInResultDto,
  TokenDto,
  LogOutResultDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SignService {
  constructor(
    @InjectRepository(User) // User 엔티티의 Repository를 주입받아 DB와 상호작용
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService, // JWT 관련 기능을 제공하는 JwtService 주입
  ) {}

  // 회원가입 로직
  async signUp(dto: SignUpRequestDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      nickname: dto.nickname,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
  }

  // 로그인 로직
  async signIn(dto: SignInRequestDto): Promise<SignInResultDto> {
    // 이메일을 기준으로 DB에서 사용자 조회
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    // 사용자가 존재하지 않으면 예외 발생
    if (!user) throw new NotFoundException('User not found');

    // 입력된 비밀번호와 저장된 해시된 비밀번호가 일치하는지 확인
    const isPasswordMatching = await bcrypt.compare(
      dto.password,
      user.password,
    );

    // 비밀번호가 일치하지 않으면 예외 발생
    if (!isPasswordMatching) throw new NotFoundException('Invalid credentials');

    // 액세스 토큰을 생성
    const atk = this.getAccessToken(user);

    // 리프레시 토큰을 생성
    const rtk = this.getRefreshToken();

    // 생성된 액세스 토큰과 리프레시 토큰을 유저 엔티티에 저장
    user.accessToken = atk;
    user.refreshToken = rtk;
    await this.userRepository.save(user); // 변경된 유저 정보를 DB에 저장

    // 액세스 토큰과 리프레시 토큰을 반환
    return {
      token: { atk, rtk },
      user_id: user.user_id,
    };
  }

  async logout(userId: number): Promise<LogOutResultDto> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.refreshToken = null;
    user.accessToken = null;
    await this.userRepository.save(user);

    const expiredToken = new TokenDto('', '');
    return new LogOutResultDto(expiredToken);
  }

  // SignService의 getAccessToken 메서드 수정
  private getAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user.user_id, // 'sub' 필드로 변경
        username: user.email, // 추가: 사용자 식별을 위한 username 포함
        roles: user.user_roles,
      },
      {
        expiresIn: '1h',
      },
    );
  }

  // 리프레시 토큰 생성 메소드
  private getRefreshToken(): string {
    return this.jwtService.sign({}, { expiresIn: '7d' });
  }
}
