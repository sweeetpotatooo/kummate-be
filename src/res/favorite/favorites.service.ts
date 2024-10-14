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
    user_id: number,
    createFavoriteDto: CreateFavoriteDto,
  ): Promise<Favorite> {
    console.log(
      `Adding favorite for user_id: ${user_id} and article_id: ${createFavoriteDto.article_id}`,
    );

    const user = await this.userRepository.findOne({
      where: { user_id: user_id },
    });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const article = await this.articleRepository.findOne({
      where: { article_id: createFavoriteDto.article_id },
    });
    if (!article) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    // 이미 즐겨찾기한 경우 예외 처리 using QueryBuilder
    const existingFavorite = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .where('favorite.user_id = :user_id', { user_id })
      .andWhere('favorite.article_id = :article_id', {
        article_id: createFavoriteDto.article_id,
      })
      .getOne();

    if (existingFavorite) {
      console.log('Favorite already exists');
      throw new ConflictException('이미 즐겨찾기한 게시글입니다.');
    }

    const favorite = this.favoriteRepository.create({ user, article });
    return this.favoriteRepository.save(favorite);
  }

  // 즐겨찾기 제거 using QueryBuilder
  async removeFavorite(
    user_id: number,
    removeFavoriteDto: RemoveFavoriteDto,
  ): Promise<void> {
    console.log(
      `Removing favorite for user_id: ${user_id} and article_id: ${removeFavoriteDto.article_id}`,
    );

    const favorite = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .where('favorite.user_id = :user_id', { user_id })
      .andWhere('favorite.article_id = :article_id', {
        article_id: removeFavoriteDto.article_id,
      })
      .getOne();

    if (!favorite) {
      console.log('Favorite not found');
      throw new NotFoundException('즐겨찾기 항목을 찾을 수 없습니다.');
    }

    await this.favoriteRepository.remove(favorite);
  }

  // 사용자의 즐겨찾기 목록 조회
  async getFavorites(
    user_id: number,
    page: number = 1,
    size: number = 10,
  ): Promise<Favorite[]> {
    console.log(
      `Fetching favorites for user_id: ${user_id}, page: ${page}, size: ${size}`,
    );

    const favorites = await this.favoriteRepository.find({
      where: { user: { user_id: user_id } },
      relations: ['article', 'article.user'],
      skip: (page - 1) * size,
      take: size,
      order: { created_at: 'DESC' },
    });
    return favorites;
  }

  // 특정 게시글의 찜 상태 확인 using QueryBuilder
  async isFavorited(user_id: number, article_id: number): Promise<boolean> {
    console.log(
      `Checking if user_id: ${user_id} has favorited article_id: ${article_id}`,
    );

    const favorite = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .where('favorite.user_id = :user_id', { user_id })
      .andWhere('favorite.article_id = :article_id', { article_id })
      .getOne();
    console.log(`Favorite found: ${favorite ? 'Yes' : 'No'}`);
    return !!favorite;
  }
}
