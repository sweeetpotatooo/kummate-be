import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { AgeGroup } from 'src/res/types/ageGroup.enum';
import { Dorm } from 'src/res/types/dorm.enum';

export class ArticleEditDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsEnum(Dorm)
  @IsOptional()
  region: Dorm;

  @IsBoolean()
  @IsOptional()
  smoke: boolean;

  @IsEnum(AgeGroup)
  @IsOptional()
  ageGroup: AgeGroup;

  @IsString()
  @IsOptional()
  content: string;

  constructor(
    title?: string,
    region?: Dorm,
    smoke?: boolean,
    ageGroup?: AgeGroup,
    content?: string,
  ) {
    this.title = title;
    this.region = region;
    this.smoke = smoke;
    this.ageGroup = ageGroup;
    this.content = content;
  }
}
