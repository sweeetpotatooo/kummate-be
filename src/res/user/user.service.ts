import {
  Injectable, // 의존성 주입을 가능하게 해주는 데코레이터
  NotFoundException, // 유저를 찾지 못했을 때 발생시키는 예외
  BadRequestException, // 잘못된 요청이 발생했을 때 발생시키는 예외
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // TypeORM의 레포지토리를 주입받기 위한 데코레이터
import { Repository } from 'typeorm'; // TypeORM에서 제공하는 레포지토리 객체
import { User } from './entities/user.entity'; // 유저 엔티티 (데이터베이스의 테이블 구조를 정의한 클래스)
import { UpdateUserDto } from './dto/update-user.dto'; // 유저 업데이트 시 사용되는 데이터 전송 객체
import { CreateUserDto } from './dto/create-user.dto'; // 유저 생성 시 사용되는 데이터 전송 객체
import * as bcrypt from 'bcrypt'; // 비밀번호 암호화를 위한 bcrypt 라이브러리
import axios from 'axios'; // HTTP 요청을 위한 Axios 라이브러리
import { MbtiCompatibilityService } from '../mbti/mbti-compatibility.service';
import { AgeGroup } from '../types/ageGroup.enum';

@Injectable() // 이 클래스가 서비스로 사용될 수 있도록 선언하는 데코레이터
export class UserService {
  constructor(
    @InjectRepository(User) // TypeORM의 유저 레포지토리를 주입받음
    private readonly usersRepository: Repository<User>, // 유저와 관련된 데이터베이스 작업을 처리하는 레포지토리
    private readonly mbtiCompatibilityService: MbtiCompatibilityService,
  ) {}

  // 이메일로 인증번호를 전송하는 메서드
  async sendVerificationCode(email: string): Promise<void> {
    console.log('Sending verification code to:', email);

    // API에 보낼 데이터
    const data = {
      key: 'd24b515a-1804-4fd5-8ac0-f48c07cc472a', // 고정된 키 값
      email: email, // 프론트에서 받아온 이메일 값
      univName: '건국대학교(글로컬)', // 고정된 대학명
      univ_check: true, // 대학 재학 여부 확인을 위해 true
    };

    try {
      const response = await axios.post(
        'https://univcert.com/api/v1/certify',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Verification code sent response:', response.data);

      if (response.status !== 200) {
        console.log('Failed to send verification code');
        throw new BadRequestException('인증번호 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error(
        'Failed to send verification code:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('인증번호 전송에 실패했습니다.');
    }
  }
  // 사용자가 입력한 인증번호를 검증하는 메서드
  async verifyCode(email: string, code: string): Promise<boolean> {
    console.log('Verifying code for email:', email, 'with code:', code);

    const data = {
      key: 'd24b515a-1804-4fd5-8ac0-f48c07cc472a',
      email: email,
      univName: '건국대학교(글로컬)',
      code: code,
    };

    try {
      const response = await axios.post(
        'https://univcert.com/api/v1/certifycode',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Verification code check response:', response.data);

      if (!response.data.success) {
        console.log('Failed to verify code');
        throw new BadRequestException('인증코드 검증에 실패했습니다.');
      }

      return true;
    } catch (error) {
      console.error(
        'Failed to verify code:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('인증코드 검증에 실패했습니다.');
    }
  }

  // 이메일 인증 상태를 확인하는 메서드
  async checkEmailVerified(email: string): Promise<boolean> {
    console.log('Checking if email is verified:', email);
    const response = await axios.post('https://univcert.com/api/v1/status', {
      email,
    });
    console.log('Email verification status response:', response.data);
    return response.data.success;
  }

  // 새로운 유저를 생성하는 메서드
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, nickname, ...rest } = createUserDto;
    console.log('Creating user with data:', rest);

    // 이메일 인증 여부 확인
    const isVerified = await this.checkEmailVerified(email);
    if (!isVerified) {
      throw new BadRequestException('이메일 인증이 완료되지 않았습니다.');
    }

    // 이메일 또는 닉네임 중복 확인
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { nickname }],
    });
    if (existingUser) {
      throw new BadRequestException('이메일 또는 닉네임이 이미 사용 중입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      nickname,
      ...rest,
    });

    console.log('Saving user:', user);
    return this.usersRepository.save(user);
  }
  // 유저 정보를 업데이트하는 메서드
  async updateUser(
    email: string, // 업데이트하려는 유저의 이메일
    updateUserDto: UpdateUserDto, // 업데이트할 데이터
  ): Promise<User> {
    console.log(`Updating user with email: ${email}`); // 로그: 유저 업데이트 시작

    // 주어진 이메일로 유저 정보를 DB에서 조회
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      // 유저가 존재하지 않으면
      console.log(`User not found for email: ${email}`); // 로그: 유저를 찾지 못했을 경우
      throw new NotFoundException(`User with email ${email} not found`); // 예외 발생: 유저가 없음
    }

    // 만약 updateUserDto에 비밀번호가 포함되어 있으면 해시 처리
    if (updateUserDto.password) {
      console.log(`Updating password for user with email: ${email}`); // 로그: 비밀번호 업데이트 시작
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10); // 비밀번호 해시
    }

    // 유저 객체에 업데이트할 데이터를 병합
    Object.assign(user, updateUserDto);
    console.log('Updated user data:', user); // 로그: 업데이트된 유저 정보 출력

    // DB에 변경된 유저 정보 저장
    return this.usersRepository.save(user);
  }

  // 유저를 삭제하는 메서드
  async deleteUser(user_id: number): Promise<void> {
    console.log('Deleting user with ID:', user_id); // 로그: 유저 삭제 시작
    const result = await this.usersRepository.delete({ user_id }); // 주어진 ID로 유저 삭제

    if (result.affected === 0) {
      // 삭제된 유저가 없으면
      console.log('User not found for deletion, ID:', user_id); // 로그: 삭제 실패
      throw new NotFoundException('User not found'); // 예외 발생: 유저를 찾지 못함
    }

    console.log('User deleted successfully, ID:', user_id); // 로그: 유저 삭제 성공
  }

  // 특정 ID로 유저를 조회하는 메서드
  async findById(userId: number): Promise<User> {
    return this.usersRepository.findOne({ where: { user_id: userId } });
  }

  // 사용자 메인 페이지를 반환하는 메서드 (예시)
  async getUserMainPage(): Promise<string> {
    console.log('Getting user main page'); // 로그: 메인 페이지 요청 시작
    return 'User Main Page'; // 메인 페이지 반환 (문자열)
  }

  // 특정 ID로 유저를 찾는 메서드
  async findUserById(user_id: number): Promise<User | null> {
    console.log('Finding user by ID:', user_id); // 로그: 유저 검색 시작
    const user = await this.usersRepository.findOne({ where: { user_id } }); // 유저 조회
    console.log('User found by ID:', user); // 로그: 유저 정보 출력
    return user || null; // 유저가 없으면 null 반환
  }

  // 이메일로 유저를 조회하는 메서드
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } }); // 이메일로 유저 조회
    if (!user) {
      // 유저가 없으면 예외 발생
      throw new NotFoundException('User not found');
    }
    return user; // 유저 반환
  }

  private isAgeInGroup(ageGroup: AgeGroup, age: number): boolean {
    switch (ageGroup) {
      case AgeGroup.age1: // '20 ~ 22'
        return age >= 20 && age <= 22;
      case AgeGroup.age2: // '23 ~ 25'
        return age >= 23 && age <= 25;
      case AgeGroup.age3: // '26 ~ '
        return age >= 26;
      default:
        return false;
    }
  }

  async findSimilarUsers(currentUser: User): Promise<User[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    queryBuilder
      .where('user.user_id != :currentUserId', {
        currentUserId: currentUser.user_id,
      })
      .andWhere('user.gender = :gender', { gender: currentUser.gender })
      .andWhere('user.isSmoker = :isSmoker', { isSmoker: currentUser.isSmoker })
      .andWhere('user.region = :region', { region: currentUser.region });

    const filteredUsers = await queryBuilder.getMany();

    // 각 유저에 대한 점수 계산
    const scoredUsers = filteredUsers.map((user) => {
      let score = 0;

      // 태그 점수 계산 (10점씩)
      if (currentUser.tags && user.tags) {
        const commonTags = currentUser.tags.filter((tag) =>
          user.tags.includes(tag),
        );
        score += commonTags.length * 10;
      }

      // 활동 시간 점수 계산 (15점)
      if (currentUser.activityTime === user.activityTime) {
        score += 15;
      }

      // 선호 나이대와 상대방의 실제 나이를 비교하여 점수 계산 (10점)
      if (this.isAgeInGroup(currentUser.ageGroup, user.age)) {
        score += 10;
      }

      // 학과 점수 계산 (20점)
      if (currentUser.department === user.department) {
        score += 20;
      }

      // MBTI 궁합 점수 계산
      const mbtiScore = this.mbtiCompatibilityService.calculateCompatibility(
        currentUser.mbti,
        user.mbti,
      );
      score += mbtiScore;

      return { user, score };
    });

    // 점수 순으로 정렬 후 상위 10명 선택
    const topUsers = scoredUsers
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry) => entry.user);

    return topUsers;
  }
}
