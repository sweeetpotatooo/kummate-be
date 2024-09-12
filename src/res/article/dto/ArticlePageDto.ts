import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsDate } from 'class-validator';
import { Article } from '../entity/article.entity'; // Article 엔티티 경로를 맞게 수정
import { User } from '../entity/user.entity'; // User 엔티티가 필요할 경우 import

export class ArticlePageDto {
  @ApiProperty({ description: 'ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '이메일' })
  @IsString()
  email: string;

  @ApiProperty({ description: '이미지 URL' })
  @IsString()
  image: string;

  @ApiProperty({ description: '닉네임' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: '내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '성별' })
  @IsString()
  gender: string;

  @ApiProperty({ description: '생성일자' })
  @IsDate()
  createdDate: Date;

  @ApiProperty({ description: '기숙사' })
  @IsString()
  region: string;

  @ApiProperty({ description: '나이대' })
  @IsString()
  ageGroup: string;

  @ApiProperty({ description: '흡연여부' })
  @IsNumber()
  smoke: string;

  @ApiProperty({ description: '모집 중 여부' })
  @IsBoolean()
  isRecruiting: boolean;

  constructor(
    id: number,
    title: string,
    email: string,
    image: string,
    nickname: string,
    content: string,
    gender: string,
    createdDate: Date,
    region: string,
    ageGroup: string,
    smoke: string,
    isRecruiting: boolean,
  ) {
    this.id = id;
    this.title = title;
    this.email = email;
    this.image = image;
    this.nickname = nickname;
    this.content = content;
    this.gender = gender;
    this.createdDate = createdDate;
    this.region = region;
    this.ageGroup = ageGroup;
    this.smoke = smoke;
    this.isRecruiting = isRecruiting;
  }

  static toDto(article: Article): ArticlePageDto {
    return new ArticlePageDto(
      article.id,
      article.title,
      article.user.email,
      article.user.image,
      article.user.nickname,
      article.content,
      article.user.gender.value,
      article.createDate,
      article.region.value,
      article.period.value,
      article.price,
      article.isRecruiting,
    );
  }

  static toDtoList(articles: Article[]): ArticlePageDto[] {
    return articles.map((article) => this.toDto(article));
  }
}
