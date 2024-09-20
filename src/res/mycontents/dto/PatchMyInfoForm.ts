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
  @IsString()
  @IsOptional()
  gender?: string;

  @IsInt()
  @IsOptional()
  myAge?: number;

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
  activityTime?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  favoriteTag?: string[];

  @IsString()
  @IsOptional()
  myText?: string;

  static toDto(form: PatchMyInfoForm): PatchMyInfoRequestDto {
    const dto = new PatchMyInfoRequestDto();
    dto.gender = form.gender;
    dto.myAge = form.myAge;
    dto.isSmoke = form.isSmoke;
    dto.activityTime = form.activityTime;
    dto.region = form.region;
    dto.mbti = form.mbti;
    dto.tags = form.favoriteTag || [];
    dto.detail = form.myText;
    return dto;
  }
}

export class PatchMyInfoRequestDto {
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
  activityTime?: string;

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

  @IsString()
  @IsOptional()
  detail?: string;
}
