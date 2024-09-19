// src/dto/patch-my-info-request.dto.ts

import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

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
}
