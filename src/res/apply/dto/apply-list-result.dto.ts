// apply-list-result.dto.ts
import { BadRequestException } from '@nestjs/common';
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
      const isApplicant = apply.applicantUser?.user_id === user_id;

      if (!apply.applicantUser || !apply.article?.user) {
        throw new BadRequestException(
          '지원자 또는 게시글 작성자 정보가 누락되었습니다.',
        );
      }

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
        createdAt: apply.createDate,
        updatedAt: apply.lastModifiedDate,
        isToMe: isApplicant,
        otherUserId: otherUserId,
        otherUserName: otherUserName,
        matchStatus: apply.approveStatus,
      };
    });

    return {
      totalCount,
      applyPageList,
    };
  }
}
