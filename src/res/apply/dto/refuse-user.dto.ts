// refuse-user.dto.ts

import { IsNotEmpty, IsNumber } from 'class-validator';

export class RefuseUserDto {
  @IsNotEmpty()
  @IsNumber()
  applyId: number;

  @IsNotEmpty()
  @IsNumber()
  articleId: number;
}
