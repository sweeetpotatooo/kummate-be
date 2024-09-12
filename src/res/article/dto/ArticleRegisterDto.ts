import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ArticleRegisterDto {
  @ApiProperty({ description: '제목', example: '같이 방쓸 컴공 선배님 구해요' })
  @IsString()
  title: string;

  @ApiProperty({ description: '기숙사', example: '모시래 4인실' })
  @IsString()
  region: string;

  @ApiProperty({ description: '나이대', example: '20 ~ 22' })
  @IsString()
  period: string;

  @ApiProperty({ description: '흡연여부', example: '안해요' })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: '내용',
    example: '컴공 선배님 구해요',
  })
  @IsString()
  content: string;

  constructor(
    title: string,
    region: string,
    ageGroup: string,
    smoke: number,
    content: string,
  ) {
    this.title = title;
    this.region = region;
    this.period = ageGroup;
    this.price = smoke;
    this.content = content;
  }
}
