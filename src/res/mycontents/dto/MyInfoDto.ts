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

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsInt()
  @IsOptional()
  student_id?: number;

  @IsString()
  @IsOptional()
  department?: string;

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

  @IsString()
  @IsOptional()
  ageGroup?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  detail?: string;

  static toDto(user: any): MyInfoDto {
    const dto = new MyInfoDto();
    dto.email = user.email;
    dto.nickname = user.nickname;
    dto.age = user.age;
    dto.image = user.image;
    dto.isSmoker = user.isSmoker;
    dto.activityTime = user.activityTime || null;
    dto.gender = user.gender || null;
    dto.region = user.region || null;
    dto.ageGroup = user.ageGroup || null;
    dto.mbti = user.mbti || null;
    dto.tags = user.tags || [];
    dto.age = user.age;
    dto.detail = user.detail;
    dto.student_id = user.student_id;
    dto.department = user.department;
    return dto;
  }
}
