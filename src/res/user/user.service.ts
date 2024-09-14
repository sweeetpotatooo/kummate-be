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

@Injectable() // 이 클래스가 서비스로 사용될 수 있도록 선언하는 데코레이터
export class UserService {
  constructor(
    @InjectRepository(User) // TypeORM의 유저 레포지토리를 주입받음
    private usersRepository: Repository<User>, // 유저와 관련된 데이터베이스 작업을 처리하는 레포지토리
  ) {}

  // 이메일로 인증번호를 전송하는 메서드
  async sendVerificationCode(email: string): Promise<void> {
    console.log('Sending verification code to:', email); // 로그: 인증번호 전송 시작
    const response = await axios.post('https://univcert.com/api/v1/certify', {
      email, // 이메일을 전달하여 외부 API로 인증 요청
    });
    console.log('Verification code sent response:', response.data); // 로그: 인증번호 전송 결과 출력
    if (response.status !== 200) {
      // 만약 HTTP 응답 상태가 200이 아니라면
      console.log('Failed to send verification code'); // 로그: 전송 실패 메시지
      throw new BadRequestException('인증번호 전송에 실패했습니다.'); // 예외 발생: 인증번호 전송 실패
    }
  }

  // 사용자가 입력한 인증번호를 검증하는 메서드
  async verifyCode(email: string, code: string): Promise<boolean> {
    console.log('Verifying code for email:', email, 'with code:', code); // 로그: 인증번호 검증 시작
    const response = await axios.post(
      'https://univcert.com/api/v1/certifycode',
      { email, code }, // 이메일과 코드로 외부 API에 검증 요청
    );
    console.log('Verification code check response:', response.data); // 로그: 검증 결과 출력
    if (!response.data.success) {
      // 인증 실패 시
      console.log('Failed to verify code'); // 로그: 인증 실패 메시지
      throw new BadRequestException('인증코드 검증에 실패했습니다.'); // 예외 발생: 인증 실패
    }
    return true; // 성공적으로 검증되면 true 반환
  }

  // 이메일 인증 상태를 확인하는 메서드
  async checkEmailVerified(email: string): Promise<boolean> {
    console.log('Checking if email is verified:', email); // 로그: 이메일 인증 상태 확인 시작
    const response = await axios.post('https://univcert.com/api/v1/status', {
      email, // 이메일을 전달하여 인증 상태 요청
    });
    console.log('Email verification status response:', response.data); // 로그: 인증 상태 결과 출력
    return response.data.verified; // 이메일 인증 여부 반환
  }

  // 새로운 유저를 생성하는 메서드
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto; // DTO에서 비밀번호와 나머지 데이터를 분리
    console.log('Creating user with data:', rest); // 로그: 유저 생성 데이터 출력
    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호를 해시 처리 (암호화)
    console.log('Hashed password:', hashedPassword); // 로그: 해시된 비밀번호 출력

    const user = this.usersRepository.create({
      ...rest, // 나머지 데이터
      password: hashedPassword, // 해시된 비밀번호를 유저 객체에 할당
    });

    console.log('Saving user:', user); // 로그: 유저 저장 시작
    return this.usersRepository.save(user); // 유저를 데이터베이스에 저장
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
  async findOne(user_id: number): Promise<User | null> {
    console.log('Finding user with ID:', user_id); // 로그: 유저 조회 시작
    const user = await this.usersRepository.findOne({
      where: { user_id }, // 주어진 ID로 유저를 검색
    });
    console.log('User found:', user); // 로그: 유저 정보 출력
    return user || null; // 유저가 있으면 반환, 없으면 null 반환
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
}
