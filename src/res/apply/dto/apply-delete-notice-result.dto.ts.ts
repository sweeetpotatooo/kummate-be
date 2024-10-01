import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ApplyDeleteNoticeResultDto {
  @ApiProperty({
    description: '신청 ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  applyId: number;
}
