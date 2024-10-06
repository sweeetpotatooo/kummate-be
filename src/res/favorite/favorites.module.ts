// src/favorites/favorites.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { User } from '../user/entities/user.entity';
import { Article } from '../article/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Article])],
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
