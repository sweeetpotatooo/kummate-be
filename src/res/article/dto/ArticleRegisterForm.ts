import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsEnum } from 'class-validator';
import { ArticleRegisterDto } from './ArticleRegisterDto';
import { AgeGroup } from 'src/res/types/ageGroup.enum';
import { Dorm } from 'src/res/types/dorm.enum';

export class ArticleRegisterForm {
  @ApiProperty({ description: '제목', example: ' 룸메이트 구해요!' })
  @IsString()
  title: string;

  @ApiProperty({ description: '기숙사', example: '모시래 4인실' })
  @IsEnum(Dorm)
  region: Dorm;

  @ApiProperty({ description: '나이대', example: '20 ~ 22' })
  @IsEnum(AgeGroup)
  ageGroup: AgeGroup;

  @ApiProperty({ description: '흡연 여부', example: '안해요' })
  @IsBoolean()
  smoke: boolean;

  @ApiProperty({ description: '내용', example: '룸메이트 구해요 :)' })
  @IsString()
  content: string;

  constructor(
    title: string,
    region: Dorm,
    ageGroup: AgeGroup,
    smoke: boolean,
    content: string,
  ) {
    this.title = title;
    this.region = region;
    this.ageGroup = ageGroup;
    this.smoke = smoke;
    this.content = content;
  }

  static toDto(form: ArticleRegisterForm): ArticleRegisterDto {
    return new ArticleRegisterDto(
      form.title,
      form.region,
      form.ageGroup,
      form.smoke,
      form.content,
    );
  }
}
