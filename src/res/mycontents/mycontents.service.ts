import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { MyInfoDto } from './dto/MyInfoDto';
import { PatchMyInfoForm } from './dto/PatchMyInfoForm';
import { PatchMyInfoResultDto } from './dto/PatchMyInfoResultDto';
import { PatchMyNicknameForm } from './dto/PatchMyNicknameForm';
import { PatchMyNicknameResult } from './dto/PatchMyNicknameResult';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class MyContentService {
  constructor(private readonly userRepository: UserRepository) {}

  // 사용자 정보 불러오기
  async getMyInfo(user: User): Promise<MyInfoDto> {
    return MyInfoDto.toDto(user); // User 엔티티를 DTO로 변환
  }

  // 닉네임 변경
  async patchNickname(
    user: User,
    form: PatchMyNicknameForm,
  ): Promise<PatchMyNicknameResult> {
    user.nickname = form.nickname;
    try {
      const result = await this.userRepository.save(user);
      return { nickname: result.nickname };
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL 고유 제약 조건 위반 코드 처리
        throw new HttpException(
          '이미 사용 중인 닉네임입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        '닉네임 변경 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 사용자 정보 수정
  async patchMyInfo(
    user: User,
    form: PatchMyInfoForm,
  ): Promise<PatchMyInfoResultDto> {
    user = this.convertUserData(user, form);
    try {
      const savedUser = await this.userRepository.save(user);
      return PatchMyInfoResultDto.from(savedUser);
    } catch (error) {
      throw new HttpException(
        '정보 수정 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 사용자 데이터를 DTO에 맞게 변환하는 함수
  private convertUserData(user: User, form: PatchMyInfoForm): User {
    const mapGender = (gender: string): Gender | undefined => {
      switch (gender) {
        case '남자':
          return Gender.MALE;
        case '여자':
          return Gender.FEMALE;
        default:
          return undefined; // 잘못된 값 처리
      }
    };

    const mappedGender = mapGender(form.gender);

    if (mappedGender) {
      user.gender = mappedGender;
    } else {
      // 예외 처리 또는 기본값 설정
      console.error('유효하지 않은 성별 값:', form.gender);
    }
    user.gender = form.gender;
    user.age = form.myAge;
    user.isSmoker = form.isSmoke;
    user.mbti = form.mbti;
    user.region = form.region;
    user.activityTime = form.activityTime;
    user.tags = Array.from(new Set(form.tags));
    user.detail = form.detail;
    return user;
  }
}
