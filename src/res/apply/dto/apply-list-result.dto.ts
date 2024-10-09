// apply-list-result.dto.ts
import { ApplyPageDto } from './apply-page.dto';

export class ApplyListResultDto {
  totalCount: number;
  applyPageList: ApplyPageDto[];

  static toMixApplicantDtoList(
    applyPage: any[],
    totalCount: number,
    user_id: number,
  ): ApplyListResultDto {
    const applyPageList: ApplyPageDto[] = applyPage.map((apply) => {
      const isApplicant = apply.applicantUser.user_id === user_id;

      // 상대방의 정보: 신청자 또는 게시글 작성자
      const otherUserId = isApplicant
        ? apply.article.user.user_id
        : apply.applicantUser.user_id;
      const otherUserName = isApplicant
        ? apply.article.user.nickname
        : apply.applicantUser.nickname;

      return {
        applyId: apply.apply_id,
        articleId: apply.article.article_id,
        articleTitle: apply.article.title,
        applicantUserId: apply.applicantUser.user_id,
        applicantUserName: apply.applicantUser.nickname,
        articleUserId: apply.article.user.user_id,
        articleUserName: apply.article.user.nickname,
        approveStatus: apply.approveStatus,
        isRead: isApplicant ? apply.isApplicantRead : apply.isArticleUserRead,
        createdAt: apply.createDate, // 수정된 필드
        updatedAt: apply.lastModifiedDate, // 수정된 필드
        isToMe: isApplicant, // 현재 사용자가 신청자인 경우 true
        otherUserId: otherUserId, // 상대방 사용자 ID
        otherUserName: otherUserName, // 상대방 사용자 이름
        matchStatus: apply.approveStatus, // 매칭 상태
      };
    });

    return {
      totalCount,
      applyPageList,
    };
  }
}
