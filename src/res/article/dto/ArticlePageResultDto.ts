// src/res/article/dto/ArticlePageResultDto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ArticlePageDto } from './ArticlePageDto';
import { Article } from '../entities/article.entity';

export class ArticlePageResultDto {
  @ApiProperty({ description: '전체 게시물 수' })
  totalCnt: number;

  @ApiProperty({ type: [ArticlePageDto], description: '게시물 리스트' })
  articles: ArticlePageDto[]; // 'articleList'를 'articles'로 변경

  constructor(totalCnt: number, articles: ArticlePageDto[]) {
    this.totalCnt = totalCnt;
    this.articles = articles;
  }

  static toDto(articlePage: {
    articles: Article[];
    totalCnt: number;
  }): ArticlePageResultDto {
    return new ArticlePageResultDto(
      articlePage.totalCnt,
      ArticlePageDto.toDtoList(articlePage.articles),
    );
  }
}
