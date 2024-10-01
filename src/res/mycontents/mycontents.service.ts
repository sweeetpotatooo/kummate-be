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
  async saveImage(file: Express.Multer.File) {
    try {
      // AWS S3에 이미지를 업로드하는 로직
      const imageName = `uploads/${Date.now()}_${file.originalname}`;
      const ext = file.originalname.split('.').pop(); // 파일 확장자를 추출
      const imageUrl = await this.awsService.imageUploadToS3(
        imageName,
        file,
        ext,
      );

      return { imageUrl };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new HttpException(
        '이미지 업로드 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
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
    userPayload: any, // 요청에서 `userPayload`를 받는다고 가정
    form: PatchMyInfoForm,
  ): Promise<PatchMyInfoResultDto> {
    try {
      // user_id를 Payload에서 추출
      let user = await this.userRepository.findOne({
        where: { user_id: userPayload.userId }, // Access Token에서 추출한 user_id
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // 사용자 정보 수정
      user = this.convertUserData(user, form);

      // 사용자 정보 업데이트
      await this.userRepository.update(user.user_id, user);

      // 업데이트된 사용자 정보 반환
      const updatedUser = await this.userRepository.findOne({
        where: { user_id: user.user_id },
      });

      return PatchMyInfoResultDto.from(updatedUser);
    } catch (error) {
      console.error('Error while updating user info:', error);
      throw new HttpException(
        '정보 수정 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // convertUserData 메서드에 구체적 예외 처리 추가
  private convertUserData(user: User, form: PatchMyInfoForm): User {
    try {
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
          console.log('Received dorm value:', form.dorm);
          return dorm as Dorm;
        } else {
          return undefined;
        }
      };

      const mappedDorm = mapDorm(form.region);
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
    } catch (error) {
      console.error('Error in convertUserData:', error);
      throw new HttpException(
        '정보 수정 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
