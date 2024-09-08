import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../res/user/entities/user.entity';
import { RefreshToken } from '../res/refresh-token/entities/RefreshToken.entity';
import {
  SignUpRequestDto,
  SignInRequestDto,
  SignInResultDto,
  TokenDto,
  LogOutResultDto,
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
  async logout(userId: number): Promise<LogOutResultDto> {
    // userId를 기반으로 사용자를 검색
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    // 사용자가 없으면 예외 발생
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 사용자의 모든 Refresh Token을 DB에서 삭제
    await this.refreshTokenRepository.delete({ user });
    console.log(`사용자 ${userId}의 리프레시 토큰을 삭제했습니다.`);

    // 만료된 토큰 정보를 반환
    const expiredToken = new TokenDto('', ''); // Refresh Token 삭제 시, 실제로 만료된 토큰 정보를 넣을 수 있음

    // 로그아웃 결과 반환
    return new LogOutResultDto(expiredToken);
  }
  catch(error) {
    console.error('Logout error:', error); // 에러를 로그로 출력
    throw new InternalServerErrorException(
      '로그아웃 처리 중 오류가 발생했습니다.',
    );
  }

  // 액세스 토큰 생성 메소드
  private getAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        id: user.user_id, // user_id를 id로 매핑
        roles: user.user_roles,
      },
      {
        expiresIn: '1h',
      },
    );
  }
  // 리프레시 토큰 생성
  private getRefreshToken(): string {
    return this.jwtService.sign({}, { expiresIn: '7d' });
  }
}
