import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import {
  FavoritesController,
  MyFavoriteController,
} from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Article } from '../article/entities/article.entity';
import { Favorite } from './entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Article, User])],
  controllers: [FavoritesController, MyFavoriteController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
