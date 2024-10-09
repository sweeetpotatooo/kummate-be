// create-apply.dto.ts
import { IsInt } from 'class-validator';

export class CreateApplyDto {
  @IsInt()
  articleId: number;
}
