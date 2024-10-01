// apply-page.dto.ts
export class ApplyPageDto {
  applyId: number;
  isToMe: boolean;
  articleId: number;
  articleTitle: string;
  otherUserId: number;
  otherUserName: string;
  matchStatus: string;
}
