// apply.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApproveUserDto } from './dto/approve-user.dto';
import { ApproveUserResultDto } from './dto/approve-user-result.dto';
import { RefuseUserResultDto } from './dto/refuse-user-result.dto';
import { ApplyDeleteResultDto } from './dto/apply-delete-result.dto';
import { ApplyListResultDto } from './dto/apply-list-result.dto';
import { ApplyDeleteNoticeResultDto } from './dto/apply-delete-notice-result.dto.ts';
import { CreateApplyDto } from './dto/create-apply.dto';
import { CreateApplyResultDto } from './dto/create-apply-result.dto';
import { User } from '../user/entities/user.entity';
import { Apply } from './entities/apply.entity';
import { Article } from '../article/entities/article.entity';
import { ApproveStatus } from '../types/ApproveStatus.enum';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(Apply)
    private readonly applyRepository: Repository<Apply>,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createApply(
    user: User,
    createApplyDto: CreateApplyDto,
  ): Promise<CreateApplyResultDto> {
    const { articleId } = createApplyDto;

    // 해당 게시글이 존재하는지 확인
    const article = await this.articleRepository.findOne({
      where: { article_id: articleId },
    });
    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 이미 신청했는지 확인
    const existingApply = await this.applyRepository.findOne({
      where: {
        applicantUser: { user_id: user.user_id },
        article: { article_id: articleId },
      },
    });
    if (existingApply) {
      throw new BadRequestException('이미 신청한 게시글입니다.');
    }

    // 새로운 신청 생성
    const newApply = this.applyRepository.create({
      applicantUser: user,
      article: article,
      approveStatus: ApproveStatus.WAIT, // 초기 상태 설정
      isApplicantDelete: false,
      isArticleUserDelete: false,
      isApplicantRead: false,
      isArticleUserRead: false,
    });

    await this.applyRepository.save(newApply);

    return {
      applyId: newApply.apply_id,
      userId: user.user_id,
      articleId: article.article_id,
      createdAt: newApply.createDate,
    };
  }

  async patchApprove(
    user: User,
    approveUserDto: ApproveUserDto,
  ): Promise<ApproveUserResultDto> {
    if (!approveUserDto.userId || !approveUserDto.articleId) {
      throw new BadRequestException('유효하지 않은 게시글입니다.');
    }

    // Apply 리스트를 가져옵니다.
    const applyList = await this.applyRepository
      .createQueryBuilder('apply')
      .leftJoinAndSelect('apply.applicantUser', 'applicantUser')
      .leftJoinAndSelect('apply.article', 'article')
      .where('article.user_id = :userId', { userId: user.user_id })
      .andWhere('article.article_id = :articleId', {
        articleId: approveUserDto.articleId,
      })
      .getMany();

    if (applyList.length === 0) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    const article = applyList[0].article;

    this.validPatchApprove(article);

    let approveApply = null;
    for (const apply of applyList) {
      if (apply.applicantUser.user_id === approveUserDto.userId) {
        apply.approveStatus = ApproveStatus.APPROVAL;
        approveApply = apply;
      } else {
        apply.approveStatus = ApproveStatus.REFUSE;
      }
    }

    if (!approveApply) {
      throw new BadRequestException('유효하지 않은 지원자 ID입니다.');
    }

    article.isRecruiting = false;

    // Apply와 Article을 저장합니다.
    await this.applyRepository.save(applyList);
    await this.articleRepository.save(article);

    return {
      approveStatus: approveApply.approveStatus,
      approveUserId: approveApply.applicantUser.user_id,
      approveUserName: approveApply.applicantUser.nickname,
      articleId: article.article_id,
      articleTitle: article.title,
    };
  }

  async patchRefuse(user: User, applyId: number): Promise<RefuseUserResultDto> {
    if (!applyId) {
      throw new BadRequestException('유효하지 않은 게시글입니다.');
    }

    const apply = await this.applyRepository.findOne({
      where: { apply_id: applyId },
      relations: ['article', 'article.user', 'applicantUser'],
    });

    if (!apply) {
      throw new NotFoundException('지원 정보를 찾을 수 없습니다.');
    }

    const article = apply.article;
    if (article.user.user_id !== user.user_id) {
      throw new ForbiddenException('사용자가 일치하지 않습니다.');
    }

    this.validPatchRefuse(apply, article);

    apply.approveStatus = ApproveStatus.REFUSE;

    await this.applyRepository.save(apply);

    return {
      approveStatus: apply.approveStatus,
      approveUserId: apply.applicantUser.user_id,
      approveUserName: apply.applicantUser.nickname,
      articleId: article.article_id,
      articleTitle: article.title,
    };
  }

  async deleteApply(
    user: User,
    applyId: number,
  ): Promise<ApplyDeleteResultDto> {
    const apply = await this.applyRepository.findOne({
      where: { apply_id: applyId },
      relations: ['article', 'article.user', 'applicantUser'],
    });

    if (!apply) {
      throw new BadRequestException('유효하지 않은 지원 ID입니다.');
    }

    const article = apply.article;

    if (
      apply.applicantUser.user_id !== user.user_id &&
      article.user.user_id !== user.user_id
    ) {
      throw new ForbiddenException('사용자가 일치하지 않습니다.');
    }

    // 삭제 플래그 설정
    if (apply.applicantUser.user_id === user.user_id) {
      apply.isApplicantDelete = true;
    } else {
      apply.isArticleUserDelete = true;
    }

    await this.applyRepository.save(apply);

    return {
      applyId: apply.apply_id,
    };
  }

  async getNotices(
    user: User,
    page: number,
    size: number,
  ): Promise<ApplyListResultDto> {
    try {
      page = page >= 1 ? page - 1 : 0;

      console.log(
        `Fetching notices for user_id: ${user.user_id}, page: ${page}, size: ${size}`,
      );

      const queryBuilder = this.applyRepository
        .createQueryBuilder('apply')
        .leftJoinAndSelect('apply.article', 'article')
        .leftJoinAndSelect('article.user', 'articleUser')
        .leftJoinAndSelect('apply.applicantUser', 'applicantUser')
        .where(
          new Brackets((qb) => {
            qb.where('apply.applicantUser.user_id = :userId', {
              userId: user.user_id,
            })
              .andWhere('apply.isApplicantDelete = :isDelete', {
                isDelete: false,
              })
              .andWhere('apply.isApplicantRead = :isRead', { isRead: false });
          }),
        )
        .orWhere(
          new Brackets((qb) => {
            qb.where('articleUser.user_id = :userId', { userId: user.user_id })
              .andWhere('apply.isArticleUserDelete = :isDelete', {
                isDelete: false,
              })
              .andWhere('apply.isArticleUserRead = :isRead', { isRead: false });
          }),
        )
        .orderBy('apply.modified_date_time', 'DESC') // 수정된 필드
        .skip(page * size)
        .take(size);

      const [applyList, totalCount] = await queryBuilder.getManyAndCount();

      console.log(
        `Fetched ${applyList.length} applies, totalCount: ${totalCount}`,
      );

      return ApplyListResultDto.toMixApplicantDtoList(
        applyList,
        totalCount,
        user.user_id,
      );
    } catch (error) {
      console.error('Error in getNotices:', error);
      throw error;
    }
  }

  async deleteNotice(
    user: User,
    applyId: number,
  ): Promise<ApplyDeleteNoticeResultDto> {
    const apply = await this.applyRepository.findOne({
      where: { apply_id: applyId },
      relations: ['article', 'article.user', 'applicantUser'],
    });

    if (!apply) {
      throw new BadRequestException('유효하지 않은 지원 ID입니다.');
    }

    if (apply.article.user.user_id === user.user_id) {
      apply.isArticleUserRead = true;
    } else if (apply.applicantUser.user_id === user.user_id) {
      apply.isApplicantRead = true;
    } else {
      throw new ForbiddenException('사용자가 일치하지 않습니다.');
    }

    await this.applyRepository.save(apply);

    return {
      applyId: apply.apply_id,
    };
  }
  async getMyApplications(
    user: User,
    page: number,
    size: number,
  ): Promise<ApplyListResultDto> {
    page = page >= 1 ? page - 1 : 0;

    const queryBuilder = this.applyRepository
      .createQueryBuilder('apply')
      .leftJoinAndSelect('apply.article', 'article')
      .leftJoinAndSelect('apply.applicantUser', 'applicantUser')
      .where('apply.applicantUser = :userId', { userId: user.user_id })
      .andWhere('apply.isApplicantDelete = :isDelete', { isDelete: false })
      .orderBy('apply.updated_at', 'DESC')
      .skip(page * size)
      .take(size);

    const [applyList, totalCount] = await queryBuilder.getManyAndCount();

    return ApplyListResultDto.toMixApplicantDtoList(
      applyList,
      totalCount,
      user.user_id,
    );
  }
  private validPatchRefuse(apply: Apply, article: Article) {
    this.validRecruitingArticle(article);

    if (apply.approveStatus === ApproveStatus.REFUSE) {
      throw new BadRequestException('이미 거절된 지원입니다.');
    }
  }

  private validPatchApprove(article: Article) {
    this.validRecruitingArticle(article);
  }

  private validRecruitingArticle(article: Article) {
    if (!article.isRecruiting) {
      throw new BadRequestException('모집이 이미 종료되었습니다.');
    }

    if (article.isDeleted) {
      throw new BadRequestException('삭제된 게시글입니다.');
    }
  }
}
