// approve-user.form.ts
import { IsInt } from 'class-validator';
import { ApproveUserDto } from './approve-user.dto';

export class ApproveUserForm {
  @IsInt()
  userId: number;

  @IsInt()
  articleId: number;

  toDto(): ApproveUserDto {
    return {
      userId: this.userId,
      articleId: this.articleId,
    };
  }
}
