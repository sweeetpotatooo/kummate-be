// mycontent.service.ts

import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { MyInfoDto } from './dto/MyInfoDto';
import { PatchMyInfoForm } from './dto/PatchMyInfoForm';
import { PatchMyInfoResultDto } from './dto/PatchMyInfoResultDto';
import { PatchMyNicknameForm } from './dto/PatchMyNicknameForm';
import { PatchMyNicknameResult } from './dto/PatchMyNicknameResult';
import { Gender } from '../types/gender.enum';
import { Mbti } from '../types/mbti.enum';
import { ActivityTime } from '../types/activitytime.enum';
import { Dorm } from '../types/dorm.enum';
import { ageGroup } from '../types/ageGroup.enum';
import { AwsService } from '../../upload/upload.service'; // AWS 서비스 import
import { UUIDService } from '../uuid/uuid.service'; // UUID 생성 등을 위한 유틸 서비스 import
import { Express } from 'express'; // Express 모듈 import

@Injectable()
export class MyContentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly awsService: AwsService,
    private readonly utilsService: UUIDService,
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
      console.error('Error while changing nickname:', error);
      if (error.code === '23505') {
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

  // 이미지 파일을 저장하는 메서드
  async saveImage(file: Express.Multer.File) {
    return await this.imageUpload(file);
  }

  // AWS S3에 이미지를 업로드하는 메서드
  async imageUpload(file: Express.Multer.File) {
    const imageName = this.utilsService.getUUID();
    const ext = file.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      file,
      ext,
    );

    return { imageUrl };
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

    const mapAgeGroup = (ageGroupStr: string): ageGroup | undefined => {
      switch (ageGroupStr) {
        case '20 ~ 22':
          return ageGroup.age1;
        case '23 ~ 25':
          return ageGroup.age2;
        case '26 ~ ':
          return ageGroup.age3;
        default:
          return undefined;
      }
    };

    const mappedAgeGroup = mapAgeGroup(form.ageGroup);

    if (mappedAgeGroup !== undefined) {
      user.ageGroup = mappedAgeGroup;
    } else {
      throw new HttpException(
        '유효하지 않은 연령대 값입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.age = form.age;
    user.isSmoker = form.isSmoke;
    user.tags = Array.from(new Set(form.favoriteTag || []));
    user.detail = form.myText || '';

    return user;
  }
}
