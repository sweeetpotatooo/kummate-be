import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { Gender } from '../../types/gender.enum';
import { ActivityTime } from '../../types/activitytime.enum';
import { Dorm } from '../../types/dorm.enum';
import { Mbti } from '../../types/mbti.enum';
import { AgeGroup } from 'src/res/types/ageGroup.enum';

export class ProfileDto {
  @IsString()
  email: string;

  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsBoolean()
  isSmoker: boolean;

  @IsOptional()
  @IsString()
  activityTime?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  ageGroup?: string;

  @IsOptional()
  @IsString()
  mbti?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @IsOptional()
  @IsString()
  detail?: string;

  static toDto(user: any): ProfileDto {
    const dto = new ProfileDto();
    dto.email = user.email;
    dto.nickname = user.nickname;
    dto.image = user.image || null;
    dto.isSmoker = user.isSmoker;
    dto.activityTime = user.activityTime
      ? ActivityTime[user.activityTime]
      : null;
    dto.ageGroup = user.ageGroup ? AgeGroup[user.ageGroup] : null;
    dto.gender = user.gender ? Gender[user.gender] : null;
    dto.region = user.region ? Dorm[user.region] : null;
    dto.mbti = user.mbti ? Mbti[user.mbti] : null;
    dto.tags = user.tags || [];
    dto.age = user.age;
    dto.detail = user.detail || null;
    return dto;
  }
}
