import { IsNumber, IsString } from 'class-validator';
import { Article } from '../entities/article.entity';

export class ArticleInfoDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  constructor(id?: number, title?: string) {
    this.id = id;
    this.title = title;
  }

  static toDto(article: Article): ArticleInfoDto {
    return new ArticleInfoDto(article.id, article.title);
  }
}
