// src/dto/favorite-article.dto.ts

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FavoriteArticleDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  modifiedDate?: Date;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  period: string;

  @IsInt()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsNotEmpty()
  isRecruiting: boolean;

  static toDto(article: any): FavoriteArticleDto {
    const dto = new FavoriteArticleDto();
    dto.id = article.id;
    dto.title = article.title;
    dto.email = article.user.email;
    dto.image = article.user.image;
    dto.nickname = article.user.nickname;
    dto.gender = article.user.gender.value;
    dto.content = article.content;
    dto.createdDate = article.createDate;
    dto.modifiedDate = article.lastModifiedDate;
    dto.region = article.region.value;
    dto.isRecruiting = article.isRecruiting;
    return dto;
  }
}
