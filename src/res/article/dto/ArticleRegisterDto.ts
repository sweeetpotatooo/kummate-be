import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsBoolean } from 'class-validator';
import { ageGroup } from 'src/res/types/ageGroup.enum';
import { Dorm } from 'src/res/types/dorm.enum';
export class ArticleRegisterDto {
  @ApiProperty({ description: '제목', example: '같이 방쓸 컴공 선배님 구해요' })
  @IsString()
  title: string;

  @ApiProperty({ description: '기숙사', example: '모시래 4인실' })
  @IsEnum(Dorm)
  region: Dorm;

  @ApiProperty({ description: '나이대', example: '20 ~ 22' })
  @IsEnum(ageGroup)
  ageGroup: ageGroup;

  @ApiProperty({ description: '흡연여부', example: '안해요' })
  @IsBoolean()
  smoke: boolean;

  @ApiProperty({
    description: '내용',
    example: '컴공 선배님 구해요',
  })
  @IsString()
  content: string;

  constructor(
    title: string,
    region: Dorm,
    ageGroup: ageGroup,
    smoke: boolean,
    content: string,
  ) {
    this.title = title;
    this.region = region;
    this.ageGroup = ageGroup;
    this.smoke = smoke;
    this.content = content;
  }
}
