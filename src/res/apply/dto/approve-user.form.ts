import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApproveUserDto } from './approve-user.dto';

export class ApproveUserForm {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  articleId: number;

  toDto(): ApproveUserDto {
    return {
      userId: this.userId,
      articleId: this.articleId,
    };
  }
}
