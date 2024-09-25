// mycontent.service.ts

import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { MyInfoDto } from './dto/MyInfoDto';
import { PatchMyInfoForm } from './dto/PatchMyInfoForm';
import { PatchMyInfoResultDto } from './dto/PatchMyInfoResultDto';
import { PatchMyNicknameForm } from './dto/PatchMyNicknameForm';
import { PatchMyNicknameResult } from './dto/PatchMyNicknameResult';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender } from '../types/gender.enum';
import { Mbti } from '../types/mbti.enum';
import { ActivityTime } from '../types/activitytime.enum';
import { Dorm } from '../types/dorm.enum';
@Injectable()
export class MyContentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 사용자 정보 불러오기
  async getMyInfo(userPayload: any): Promise<MyInfoDto> {
    const user = await this.userRepository.findOne({
      where: { user_id: userPayload.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return MyInfoDto.toDto(user);
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
        // 고유 제약 조건 위반 (닉네임 중복)
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
    // 성별 매핑
    const mapGender = (gender: string): Gender | undefined => {
      switch (gender) {
        case '남자':
          return Gender.MALE;
        case '여자':
          return Gender.FEMALE;
        default:
          return undefined;
      }
    };

    const mappedGender = mapGender(form.gender);

    if (mappedGender !== undefined) {
      user.gender = mappedGender;
    } else {
      throw new HttpException(
        '유효하지 않은 성별 값입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // MBTI 매핑
    const mapMbti = (mbti: string): Mbti | undefined => {
      const upperMbti = mbti.toUpperCase();
      if (Object.values(Mbti).includes(upperMbti as Mbti)) {
        return upperMbti as Mbti;
      } else {
        return undefined;
      }
    };

    const mappedMbti = mapMbti(form.mbti);

    if (mappedMbti !== undefined) {
      user.mbti = mappedMbti;
    } else {
      throw new HttpException(
        '유효하지 않은 MBTI 값입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 활동 시간 매핑
    const mapActivityTime = (time: string): ActivityTime | undefined => {
      switch (time) {
        case '밤':
          return ActivityTime.MIDNIGHT;
        case '아침':
          return ActivityTime.MORNING;
        case '오후':
          return ActivityTime.AFTERNOON;
        case '저녁':
          return ActivityTime.EVENING;
        default:
          return undefined;
      }
    };

    const mappedActivityTime = mapActivityTime(form.activityTime);

    if (mappedActivityTime !== undefined) {
      user.activityTime = mappedActivityTime;
    } else {
      throw new HttpException(
        '유효하지 않은 활동 시간 값입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 기숙사 매핑
    const mapDorm = (dorm: string): Dorm | undefined => {
      if (Object.values(Dorm).includes(dorm as Dorm)) {
        return dorm as Dorm;
      } else {
        return undefined;
      }
    };

    const mappedDorm = mapDorm(form.dorm);

    if (mappedDorm !== undefined) {
      user.region = mappedDorm;
    } else {
      throw new HttpException(
        '유효하지 않은 기숙사 값입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 나머지 필드 할당
    user.age = form.myAge;
    user.isSmoker = form.isSmoke;

    // 태그와 상세 내용 할당
    user.tags = Array.from(new Set(form.favoriteTag || []));
    user.detail = form.myText || '';

    return user;
  }
}
