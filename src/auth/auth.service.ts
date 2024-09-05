/*
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/auth.dto';
import { User } from '../res/user/entities/user.entity';
import { UserService } from '../res/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokenData } from './auth.type';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, // 유저 관련 DB 작업 서비스
    private readonly jwtService: JwtService, // JWT 토큰 관련 서비스
    private readonly configService: ConfigService, // 환경변수 관련 서비스
  ) {}

  // 로그인 로직
  async login(loginDto: LoginDto): Promise<TokenData> {
    // 유저 정보 인증 (이메일과 비밀번호 확인)
    const user = await this.validateUser(loginDto);
    // 액세스 토큰 생성
    const atk = await this.createAccessToken(user);
    // 리프레시 토큰 생성
    const rtk = await this.createRefreshToken(user);

    // 유저의 리프레시 토큰을 DB에 저장
    await this.setUserCurrentRefreshToken(user.email, rtk);

    // 액세스 토큰, 리프레시 토큰, 만료 시간 반환
    return {
      atk,
      rtk,
      expiresIn: parseInt(
        this.configService.get<string>('JWT_ACCESS_TOKEN_EXP'),
      ),
    };
  }

  // 로그아웃 로직
  async logout(userId: string): Promise<void> {
    // 로그아웃 시 DB에 저장된 유저의 리프레시 토큰을 null로 변경
    await this.userService.updateUser(userId, {
      currentRefreshToken: null, // 리프레시 토큰을 null로 설정
    });
  }

  // 리프레시 토큰을 사용해 새로운 액세스 토큰을 발급하는 로직
  async refresh(email: string, refreshToken: string): Promise<TokenData> {
    // DB에 저장된 리프레시 토큰과 사용자가 제공한 리프레시 토큰 비교
    const result = await this.compareUserRefreshToken(email, refreshToken);
    if (!result) {
      throw new UnauthorizedException('You need to log in first'); // 토큰 불일치 시 예외 발생
    }

    // 유저 정보 조회 후 새로운 액세스 토큰 발급
    const user = await this.userService.getUserByEmail(email);
    const atk = await this.createAccessToken(user);

    // 새롭게 발급된 액세스 토큰과 리프레시 토큰 반환
    return {
      atk,
      rtk: refreshToken,
      expiresIn: parseInt(
        this.configService.get<string>('JWT_ACCESS_TOKEN_EXP'),
      ),
    };
  }

  // 유저 정보(이메일, 비밀번호) 검증
  async validateUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    // 이메일을 통해 유저 정보 조회
    const user = await this.userService.getUserByEmail(email);

    // 사용자가 입력한 비밀번호와 DB에 저장된 비밀번호 비교
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new UnauthorizedException('password is wrong'); // 비밀번호 불일치 시 예외 발생
    }

    // 비밀번호가 일치하면 유저 정보 반환
    return user;
  }

  // 액세스 토큰 생성 로직
  async createAccessToken(user: User): Promise<string> {
    // JWT 페이로드 설정 (유저 정보 포함)
    const payload = {
      userId: user.user_id,
      name: user.username,
      age: user.age,
      sex: user.gender,
    };

    // JWT 액세스 토큰 생성
    const atk = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'), // 액세스 토큰 시크릿 키
      expiresIn: parseInt(
        this.configService.get<string>('JWT_ACCESS_TOKEN_EXP'), // 액세스 토큰 만료 시간 설정
      ),
    });

    // 생성된 액세스 토큰 반환
    return atk;
  }

  // 리프레시 토큰 생성 로직
  async createRefreshToken(user: User): Promise<string> {
    // 리프레시 토큰 페이로드 설정 (유저 ID만 포함)
    const payload = {
      userId: user.user_id,
    };

    // JWT 리프레시 토큰 생성
    const rtk = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'), // 리프레시 토큰 시크릿 키
      expiresIn: parseInt(
        this.configService.get<string>('JWT_REFRESH_TOKEN_EXP'), // 리프레시 토큰 만료 시간 설정
      ),
    });

    // 생성된 리프레시 토큰 반환
    return rtk;
  }

  // DB에 저장된 리프레시 토큰과 현재 리프레시 토큰을 비교
  async compareUserRefreshToken(email: string, rtk: string): Promise<boolean> {
    // 유저 정보 조회
    const user = await this.userService.getUserByEmail(email);

    // 유저가 리프레시 토큰을 가지고 있지 않으면 false 반환
    if (!user.currentRefreshToken) return false;

    // DB에 저장된 리프레시 토큰과 제공된 리프레시 토큰 비교
    const result = await bcrypt.compare(rtk, user.currentRefreshToken);
    if (!result) return false; // 불일치 시 false 반환

    return true; // 일치하면 true 반환
  }

  // 유저의 현재 리프레시 토큰을 암호화하여 DB에 저장

  async setUserCurrentRefreshToken(email: string, rtk: string): Promise<void> {
    // 리프레시 토큰 암호화
    const hashedRefreshToken = await bcrypt.hash(rtk, 10);

    // 현재 날짜와 토큰 만료 시간 계산
    const now = new Date();
    const exp = parseInt(
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXP'),
    );
    const refreshTokenExp = new Date(now.getTime() + exp * 1000); // exp가 초 단위일 경우 * 1000

    // DB에 리프레시 토큰과 만료 시간을 저장
    await this.userService.updateUser(email, {
      currentRefreshToken: hashedRefreshToken, // 암호화된 리프레시 토큰 저장
      currentRefreshTokenExp: refreshTokenExp, // 토큰 만료 시간 저장
    });
  }
}
*/
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../res/user/entities/user.entity';
import { RefreshToken } from '../res/refresh-token/entities/RefreshToken.entity';
import {
  SignUpRequestDto,
  SignInRequestDto,
  SignInResultDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignService {
  constructor(
    @InjectRepository(User) // User 엔티티의 Repository 주입
    private readonly userRepository: Repository<User>,

    @InjectRepository(RefreshToken) // RefreshToken 엔티티의 Repository 주입
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    private readonly jwtService: JwtService,
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
    // 이메일을 통해 유저를 찾을 때 'where' 옵션을 사용
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('User not found');

    const isPasswordMatching = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordMatching) throw new NotFoundException('Invalid credentials');

    const atk = this.getAccessToken(user);
    const rtk = this.getRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7일 만료 기간

    // Refresh Token을 DB에 저장
    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: rtk,
      user,
      expiresAt,
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      token: { atk, rtk },
    };
  }

  // 로그아웃 로직
  async logout(userId: number): Promise<void> {
    // userId를 기반으로 사용자 검색 시 'where' 옵션 사용
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    // 유저와 관련된 모든 Refresh Token을 DB에서 삭제
    await this.refreshTokenRepository.delete({ user });
  }

  // 액세스 토큰 생성
  private getAccessToken(user: User): string {
    return this.jwtService.sign(
      { id: user.user_id, roles: user.user_roles },
      { expiresIn: '1h' },
    );
  }

  // 리프레시 토큰 생성
  private getRefreshToken(): string {
    return this.jwtService.sign({}, { expiresIn: '7d' });
  }
}
