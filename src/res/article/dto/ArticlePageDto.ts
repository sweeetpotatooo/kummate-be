import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { Article } from '../entities/article.entity';

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
  @IsString()
  createDate: string; // Date를 string으로 변환

  @ApiProperty({ description: '기숙사' })
  @IsString()
  region: string;

  @ApiProperty({ description: '나이대' })
  @IsString()
  ageGroup: string;

  @ApiProperty({ description: '흡연여부' })
  @IsBoolean()
  smoke: boolean;

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
    createDate: string,
    region: string,
    ageGroup: string,
    smoke: boolean,
    isRecruiting: boolean,
  ) {
    this.id = id;
    this.title = title;
    this.email = email;
    this.image = image;
    this.nickname = nickname;
    this.content = content;
    this.gender = gender;
    this.createDate = createDate;
    this.region = region;
    this.ageGroup = ageGroup;
    this.smoke = smoke;
    this.isRecruiting = isRecruiting;
  }

  static toDto(article: Article): ArticlePageDto {
    return new ArticlePageDto(
      article.article_id,
      article.title,
      article.user.email,
      article.user.image,
      article.user.nickname,
      article.content,
      article.user.gender,
      article.createDate.toISOString(), // Date를 string으로 변환
      article.region,
      article.ageGroup,
      article.smoke,
      article.isRecruiting,
    );
  }

  static toDtoList(articles: Article[]): ArticlePageDto[] {
    return articles.map((article) => this.toDto(article));
  }
}
