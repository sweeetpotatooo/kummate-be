import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  MyArticleDto,
  MyInfoDto,
  PatchMyInfoRequestDto,
  PatchMyInfoResultDto,
  PatchMyNicknameRequestDto,
  PatchMyNicknameResult,
  PostMyInfoImageRequestDto,
  PostMyInfoImageResultDto,
} from './dto';
import { UserRepository } from './repositories';
import { S3Service } from './s3.service';
import { CustomException, ErrorCode } from './exceptions';
import { User } from '../user/entities/user.entity';
import { Gender } from '../types/gender.enum';
import { Mbti } from '../types/mbti.enum';
import { Dorm } from '../types/dorm.enum';
import { ActivityTime } from '../types/activitytime.enum';
import { Department } from '../types/department.enum';

@Injectable()
export class MyContentService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly userRepository: UserRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly s3Service: S3Service,
  ) {}

  async getMyArticle(user: User): Promise<MyArticleDto[]> {
    return this.articleRepository.getMyArticle(user);
  }

  async getMyFavoriteArticle(user: User): Promise<FavoriteArticleDto[]> {
    return this.articleRepository.getFavoriteArticle(user);
  }

  async getMyInfo(user: User): Promise<MyInfoDto> {
    return MyInfoDto.toDto(user);
  }

  async patchNickname(
    user: User,
    dto: PatchMyNicknameRequestDto,
  ): Promise<PatchMyNicknameResult> {
    user.nickname = dto.nickname;

    try {
      const result = await this.userRepository.save(user);
      return { nickname: result.nickname };
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL 고유 제약 조건 위반 코드
        throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);
      }
      throw new HttpException('Nickname change failed', HttpStatus.BAD_REQUEST);
    }
  }

  async patchMyInfo(
    user: User,
    dto: PatchMyInfoRequestDto,
  ): Promise<PatchMyInfoResultDto> {
    const updatedUser = this.convertUserData(user, dto);
    const savedUser = await this.userRepository.save(updatedUser);
    return PatchMyInfoResultDto.from(savedUser);
  }

  async postMyInfoImage(
    user: User,
    dto: PostMyInfoImageRequestDto,
  ): Promise<PostMyInfoImageResultDto> {
    const imageUrl = await this.s3Service.uploadFile(dto.image);
    user.image = imageUrl;
    await this.userRepository.save(user);

    return { image: imageUrl };
  }

  private convertUserData(user: User, dto: PatchMyInfoRequestDto): User {
    try {
      user.gender = Gender.fromValue(dto.gender);
      user.age = dto.myAge;
      user.isSmoker = dto.isSmoke;
      user.mbti = dto.mbti;
      user.region = dto.dorm;
      user.activityTime = dto.activityTime;
      user.tags = new Set(dto.tags);
      user.detail = dto.detail;

      return user;
    } catch (error) {
      throw new CustomException(ErrorCode.PATCH_MY_INFO_CONVERT_FAIL);
    }
  }
}
