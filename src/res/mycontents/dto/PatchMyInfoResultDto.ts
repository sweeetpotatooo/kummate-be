// src/dto/patch-my-info-result.dto.ts

import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { User } from 'src/res/user/entities/user.entity';
export class PatchMyInfoResultDto {
  @IsString()
  @IsOptional()
  gender?: string;

  @IsInt()
  @IsOptional()
  myAge?: number;

  @IsInt()
  @IsOptional()
  minAge?: number;

  @IsInt()
  @IsOptional()
  maxAge?: number;

  @IsBoolean()
  @IsOptional()
  isSmoke?: boolean;

  @IsString()
  @IsOptional()
  mbti?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  activityTime?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  detail?: string;

  static from(user: User): PatchMyInfoResultDto {
    const dto = new PatchMyInfoResultDto();
    dto.gender = user.gender ? user.gender : null;
    dto.myAge = user.age;
    dto.isSmoke = user.isSmoker;
    dto.mbti = user.mbti ? user.mbti : null;
    dto.region = user.region ? user.region : null;
    dto.activityTime = user.activityTime ? user.activityTime : null;
    dto.tags = user.tags ? Array.from(user.tags) : [];
    dto.detail = user.detail;
    return dto;
  }
}
