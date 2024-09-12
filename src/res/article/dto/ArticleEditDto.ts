import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ArticleEditDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  region: string;

  @IsString()
  @IsOptional()
  smoke: string;

  @IsNumber()
  @IsOptional()
  ageGroup: string;

  @IsString()
  @IsOptional()
  content: string;

  constructor(
    title?: string,
    region?: string,
    smoke?: string,
    ageGroup?: string,
    content?: string,
  ) {
    this.title = title;
    this.region = region;
    this.smoke = smoke;
    this.ageGroup = ageGroup;
    this.content = content;
  }
}
