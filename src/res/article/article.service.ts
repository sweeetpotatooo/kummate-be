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
import { ArticleInfoDto } from './dto/ArticleInfoDto';
import { ArticlePageDto } from './dto/ArticlePageDto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  // 게시글 작성
  async postArticle(user: User, dto: ArticleRegisterDto): Promise<void> {
    if (
      !dto.title ||
      !dto.content ||
      !dto.region ||
      !dto.ageGroup ||
      !dto.smoke
    ) {
      throw new BadRequestException('유효하지 않은 게시글입니다.');
    }

    // 사용자당 최대 게시글 수 제한 (예: 5개)
    const userArticleCount = await this.articleRepository.count({
      where: { user: user, isDeleted: false, isRecruiting: true },
    });

    if (userArticleCount >= 5) {
      throw new BadRequestException('게시글 작성 한도를 초과했습니다.');
    }

    const article = this.articleRepository.create({
      ...dto,
      user: user,
      isRecruiting: true,
      isDeleted: false,
    });

    await this.articleRepository.save(article);
  }

  // 게시글 가져오기
  async getArticle(id: number): Promise<ArticlePageDto> {
    const article = await this.articleRepository.findOne({
      where: { id: id, isDeleted: false },
      relations: ['user'],
    });

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return ArticlePageDto.toDto(article);
  }

  // 작성자 작성글 보기
  async getUserArticles(userId: number): Promise<ArticleInfoDto[]> {
    const articles = await this.articleRepository.find({
      where: { user: { user_id: userId }, isDeleted: false },
    });

    return articles.map((article) => ArticleInfoDto.toDto(article));
  }

  // 게시글 수정
  async putArticle(user: User, id: number, dto: ArticleEditDto): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { id: id },
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

    if (article.user.user_id !== user.user_id) {
      throw new BadRequestException('작성자가 아닙니다.');
    }

    // DTO에 값이 있을 경우에만 업데이트
    if (dto.title) article.title = dto.title;
    if (dto.content) article.content = dto.content;
    if (dto.region) article.region = dto.region;
    if (dto.ageGroup) article.ageGroup = dto.ageGroup;
    if (dto.smoke) article.smoke = dto.smoke;

    await this.articleRepository.save(article);
  }

  // 게시글 삭제
  async deleteArticle(user: User, id: number): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (article.isDeleted) {
      throw new BadRequestException('이미 삭제된 게시글입니다.');
    }

    if (article.user.user_id !== user.user_id) {
      throw new BadRequestException('작성자가 아닙니다.');
    }

    article.isDeleted = true;

    // 지원자 처리 로직 추가 필요 시 여기에 구현

    await this.articleRepository.save(article);
  }
}
