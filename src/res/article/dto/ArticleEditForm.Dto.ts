import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ArticleEditDto } from './ArticleEditDto';
import { Dorm } from 'src/res/types/dorm.enum';
import { AgeGroup } from 'src/res/types/ageGroup.enum';

export class ArticleEditForm {
  @ApiProperty({ description: '제목', example: '같이 방쓸 컴공 선배님 구해요' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: '기숙사', example: '모시래 4인실' })
  @IsEnum(Dorm)
  @IsOptional()
  region: Dorm;

  @ApiProperty({ description: '나이대', example: '20 ~ 22' })
  @IsEnum(AgeGroup)
  @IsOptional()
  ageGroup: AgeGroup;

  @ApiProperty({ description: '흡연여부', example: '안해요' })
  @IsBoolean()
  @IsOptional()
  smoke: boolean;

  @ApiProperty({
    description: '내용',
    example: '컴공 선배님 구해요',
  })
  @IsString()
  @IsOptional()
  content: string;

  constructor(
    title?: string,
    region?: Dorm,
    ageGroup?: AgeGroup,
    smoke?: boolean,
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
