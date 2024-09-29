// src/dto/patch-my-info-form.dto.ts

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class PatchMyInfoForm {
  @IsOptional()
  gender?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsBoolean()
  @IsNotEmpty()
  isSmoke: boolean;

  @IsString()
  @IsOptional()
  mbti?: string;

  @IsString()
  @IsOptional()
  ageGroup?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  dorm?: string;

  @IsString()
  @IsOptional()
  activityTime?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  favoriteTag?: string[];

  @IsString()
  @IsOptional()
  myText?: string;
  profileImage: string;

  static toDto(form: PatchMyInfoForm): PatchMyInfoRequestDto {
    const dto = new PatchMyInfoRequestDto();
    dto.gender = form.gender;
    dto.age = form.age;
    dto.isSmoke = form.isSmoke;
    dto.activityTime = form.activityTime;
    dto.region = form.region;
    dto.mbti = form.mbti;
    dto.tags = form.favoriteTag || [];
    dto.dorm = form.dorm;
    dto.detail = form.myText;
    dto.ageGroup = form.ageGroup;
    return dto;
  }
}

export class PatchMyInfoRequestDto {
  @IsString()
  @IsOptional()
  gender?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsBoolean()
  @IsOptional()
  isSmoke?: boolean;

  @IsString()
  @IsOptional()
  activityTime?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  dorm?: string;

  @IsString()
  @IsOptional()
  mbti?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  detail?: string;
  ageGroup: string;
}
