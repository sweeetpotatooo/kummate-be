// src/articles/article.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ArticleRegisterDto } from './dto/ArticleRegisterDto';
import { ArticleEditDto } from './dto/ArticleEditDto';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ArticlePageDto } from './dto/ArticlePageDto';
import { UserService } from '../user/user.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly userService: UserService,
  ) {}

  async postArticle(user_id: number, dto: ArticleRegisterDto): Promise<void> {
    if (
      !dto.title ||
      !dto.content ||
      !dto.region ||
      !dto.ageGroup ||
      dto.smoke == null
    ) {
      throw new BadRequestException('유효하지 않은 게시글입니다.');
    }
    // 사용자 조회
    const user = await this.userService.findById(user_id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 사용자당 최대 게시글 수 제한 (예: 5개)
    const userArticleCount = await this.articleRepository.count({
      where: {
        user: { user_id: user.user_id },
        isDeleted: false,
        isRecruiting: true,
      },
    });

    if (userArticleCount >= 5) {
      throw new BadRequestException('게시글 작성 한도를 초과했습니다.');
    }

    const article = this.articleRepository.create({
      ...dto,
      user: user, // User 엔티티 할당
      isRecruiting: true,
      isDeleted: false,
    });

    await this.articleRepository.save(article);
  }

  // 게시글 가져오기
  async getArticle(id: number): Promise<ArticlePageDto> {
    const article = await this.articleRepository.findOne({
      where: { article_id: id, isDeleted: false },
      relations: ['user'],
    });

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return ArticlePageDto.toDto(article);
  }

  async getAllArticles(
    query,
  ): Promise<{ articles: ArticlePageDto[]; totalCnt: number }> {
    console.log('Received query parameters:', query);

    const { page = 1, size = 10, isRecruiting } = query;

    const isRecruitingBool = isRecruiting === 'true';

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .where('article.isDeleted = :isDeleted', { isDeleted: false });

    if (isRecruiting !== undefined) {
      queryBuilder.andWhere('article.isRecruiting = :isRecruiting', {
        isRecruiting: isRecruitingBool,
      });
    }

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(size as string, 10) || 10;

    try {
      const [articles, totalCnt] = await queryBuilder
        .orderBy('article.createDate', 'DESC')
        .skip((pageNumber - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      return {
        articles: articles.map((article) => ArticlePageDto.toDto(article)),
        totalCnt,
      };
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  // 작성자 작성글 보기
  async getUserArticles(
    userId: number,
    page: number = 1,
    size: number = 10,
  ): Promise<{ articles: ArticlePageDto[]; totalCnt: number }> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .where('article.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('user.user_id = :userId', { userId });

    const [articles, totalCnt] = await queryBuilder
      .orderBy('article.createDate', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    return {
      articles: articles.map((article) => ArticlePageDto.toDto(article)),
      totalCnt,
    };
  }

  // 게시글 수정
  async putArticle(user: User, id: number, dto: ArticleEditDto): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { article_id: id },
      relations: ['user'],
    });

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (article.isDeleted) {
      throw new BadRequestException('이미 삭제된 게시글입니다.');
    }

    if (!article.isRecruiting) {
      throw new BadRequestException('모집이 종료된 게시글입니다.');
    }

    // 사용자 ID 비교
    if (article.user.user_id !== user.user_id) {
      throw new BadRequestException('작성자가 아닙니다.');
    }

    // DTO에 값이 있을 경우에만 업데이트
    if (dto.title) article.title = dto.title;
    if (dto.content) article.content = dto.content;
    if (dto.region) article.region = dto.region;
    if (dto.ageGroup) article.ageGroup = dto.ageGroup;
    if (dto.smoke !== undefined) article.smoke = dto.smoke;

    await this.articleRepository.save(article);
  }

  // 게시글 삭제
  async deleteArticle(user: User, id: number): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { article_id: id },
      relations: ['user'],
    });

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (article.isDeleted) {
      throw new BadRequestException('이미 삭제된 게시글입니다.');
    }

    // 사용자 ID 비교
    if (article.user.user_id !== user.user_id) {
      throw new BadRequestException('작성자가 아닙니다.');
    }

    article.isDeleted = true;

    // 지원자 처리 로직 추가 필요 시 여기에 구현

    await this.articleRepository.save(article);
  }

  // 게시글 필터링
  async filterArticles(
    query,
  ): Promise<{ articles: ArticlePageDto[]; totalCnt: number }> {
    const {
      region,
      ageGroup,
      smoke,
      gender,
      page = 1,
      size = 10,
      isRecruiting,
    } = query;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .where('article.isDeleted = :isDeleted', { isDeleted: false });

    if (region && region !== '상관 없음') {
      queryBuilder.andWhere('article.region = :region', { region });
    }
    if (ageGroup && ageGroup !== '상관 없음') {
      queryBuilder.andWhere('article.ageGroup = :ageGroup', { ageGroup });
    }
    if (smoke !== undefined && smoke !== '') {
      queryBuilder.andWhere('article.smoke = :smoke', {
        smoke: smoke === 'true',
      });
    }
    if (gender && gender !== '상관 없음') {
      queryBuilder.andWhere('user.gender = :gender', { gender });
    }
    if (isRecruiting !== undefined) {
      queryBuilder.andWhere('article.isRecruiting = :isRecruiting', {
        isRecruiting: isRecruiting === 'true',
      });
    }

    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(size as string, 10) || 10;

    try {
      const [articles, totalCnt] = await queryBuilder
        .orderBy('article.createDate', 'DESC') // 최신순 정렬
        .skip((pageNumber - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      return {
        articles: articles.map((article) => ArticlePageDto.toDto(article)),
        totalCnt,
      };
    } catch (error) {
      console.error('Error fetching filtered articles:', error);
      throw error;
    }
  }
}
