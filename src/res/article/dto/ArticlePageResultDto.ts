import { ApiProperty } from '@nestjs/swagger';
import { ArticlePageDto } from './article-page.dto';
import { Article } from '../entity/article.entity';

export class ArticlePageResultDto {
  @ApiProperty({ description: '전체 게시물 수' })
  totalCnt: number;

  @ApiProperty({ type: [ArticlePageDto], description: '게시물 리스트' })
  articleList: ArticlePageDto[];

  constructor(totalCnt: number, articleList: ArticlePageDto[]) {
    this.totalCnt = totalCnt;
    this.articleList = articleList;
  }

  static toDto(articlePage: {
    totalCnt: number;
    articles: Article[];
  }): ArticlePageResultDto {
    return new ArticlePageResultDto(
      articlePage.totalCnt,
      ArticlePageDto.toDtoList(articlePage.articles),
    );
  }
}
