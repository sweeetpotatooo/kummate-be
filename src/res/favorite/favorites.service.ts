// src/favorites/favorites.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { User } from '../user/entities/user.entity';
import { Article } from '../article/entities/article.entity';
import { FavoriteArticleDto } from './dto/favorite-article.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,

    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  // 즐겨찾기 추가/삭제 토글
  async toggleFavorite(user: User, articleId: number): Promise<string> {
    const article = await this.articleRepository.findOne({
      where: { article_id: articleId },
    });
    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        user: { user_id: user.user_id },
        article: { article_id: article.article_id },
      },
      relations: ['user', 'article'],
    });

    if (existingFavorite) {
      await this.favoriteRepository.remove(existingFavorite);
      return '즐겨찾기 삭제 완료';
    } else {
      const favorite = this.favoriteRepository.create({ user, article });
      await this.favoriteRepository.save(favorite);
      return '즐겨찾기 등록 완료';
    }
  }

  // 즐겨찾기한 게시글 목록 조회
  async getFavoriteArticles(user: User): Promise<FavoriteArticleDto[]> {
    const favorites = await this.favoriteRepository.find({
      where: { user: { user_id: user.user_id } },
      relations: ['article', 'article.user'],
    });

    return favorites.map(
      (favorite) => new FavoriteArticleDto(favorite.article),
    );
  }
}
