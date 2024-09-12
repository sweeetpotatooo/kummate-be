import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ArticleEditDto } from './ArticleEditDto';

export class ArticleEditForm {
  @ApiProperty({ description: '제목', example: '같이 방쓸 컴공 선배님 구해요' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: '기숙사', example: '모시래 4인실' })
  @IsString()
  @IsOptional()
  region: string;

  @ApiProperty({ description: '나이대', example: '20 ~ 22' })
  @IsString()
  @IsOptional()
  ageGroup: string;

  @ApiProperty({ description: '흡연여부', example: '안해요' })
  @IsNumber()
  @IsOptional()
  smoke: string;

  @ApiProperty({
    description: '내용',
    example: '컴공 선배님 구해요',
  })
  @IsString()
  @IsOptional()
  content: string;

  constructor(
    title?: string,
    region?: string,
    ageGroup?: string,
    smoke?: string,
    content?: string,
  ) {
    this.title = title;
    this.region = region;
    this.ageGroup = ageGroup;
    this.smoke = smoke;
    this.content = content;
  }

  static toDto(form: ArticleEditForm): ArticleEditDto {
    return new ArticleEditDto(
      form.title,
      form.region,
      form.smoke,
      form.ageGroup,
      form.content,
    );
  }
}
