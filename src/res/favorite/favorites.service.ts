// src/favorites/favorites.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { RemoveFavoriteDto } from './dto/remove-favorite.dto';
import { User } from '../user/entities/user.entity';
import { Article } from '../article/entities/article.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  // 즐겨찾기 추가
  async addFavorite(
    userId: number,
    createFavoriteDto: CreateFavoriteDto,
  ): Promise<Favorite> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const article = await this.articleRepository.findOne({
      where: { article_id: createFavoriteDto.articleId },
    });
    if (!article) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    // 이미 즐겨찾기한 경우 예외 처리
    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        user: { user_id: userId },
        article: { article_id: createFavoriteDto.articleId },
      },
    });
    if (existingFavorite) {
      throw new ConflictException('이미 즐겨찾기한 게시글입니다.');
    }

    const favorite = this.favoriteRepository.create({ user, article });
    return this.favoriteRepository.save(favorite);
  }

  // 즐겨찾기 제거
  async removeFavorite(
    userId: number,
    removeFavoriteDto: RemoveFavoriteDto,
  ): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        user: { user_id: userId },
        article: { article_id: removeFavoriteDto.articleId },
      },
    });
    if (!favorite)
      throw new NotFoundException('즐겨찾기 항목을 찾을 수 없습니다.');

    await this.favoriteRepository.remove(favorite);
  }

  // 사용자의 즐겨찾기 목록 조회
  async getFavorites(
    userId: number,
    page: number = 1,
    size: number = 10,
  ): Promise<Favorite[]> {
    const favorites = await this.favoriteRepository.find({
      where: { user: { user_id: userId } }, // 'id'를 'user_id'로 변경
      relations: ['article'],
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });
    return favorites;
  }
}
