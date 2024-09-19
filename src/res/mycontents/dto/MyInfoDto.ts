// src/dto/my-info.dto.ts

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class MyInfoDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  isSmoker?: boolean;

  @IsString()
  @IsOptional()
  activityTime?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  mbti?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsInt()
  @IsOptional()
  minAge?: number;

  @IsInt()
  @IsOptional()
  maxAge?: number;

  @IsInt()
  @IsOptional()
  myAge?: number;

  @IsString()
  @IsOptional()
  detail?: string;

  static toDto(user: any): MyInfoDto {
    const dto = new MyInfoDto();
    dto.email = user.email;
    dto.nickname = user.nickname;
    dto.image = user.image;
    dto.isSmoker = user.isSmoker;
    dto.activityTime = user.activityTime ? user.activityTime.value : 'null';
    dto.gender = user.gender ? user.gender.value : 'null';
    dto.region = user.region ? user.region.value : 'null';
    dto.mbti = user.mbti ? user.mbti.name : 'null';
    dto.tags = user.tag || [];
    dto.minAge = user.minAge;
    dto.maxAge = user.maxAge;
    dto.myAge = user.myAge;
    dto.detail = user.detail;
    return dto;
  }
}
