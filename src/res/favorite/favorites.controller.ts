// src/favorites/favorites.controller.ts

import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { RemoveFavoriteDto } from './dto/remove-favorite.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../../auth/guard/accessToken.guard';

@ApiTags('Favorites 즐겨찾기 API')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
@Controller('api/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({
    summary: '즐겨찾기 추가',
    description: '특정 게시글을 즐겨찾기에 추가합니다.',
  })
  @Post()
  async addFavorite(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @Request() req: any,
  ) {
    const user = req.user;
    const user_id = user.user_id;
    const favorite = await this.favoritesService.addFavorite(
      user_id,
      createFavoriteDto,
    );
    return {
      statusCode: 201,
      message: '즐겨찾기에 추가되었습니다.',
      data: favorite,
    };
  }

  @ApiOperation({
    summary: '즐겨찾기 제거',
    description: '특정 게시글을 즐겨찾기에서 제거합니다.',
  })
  @Delete()
  async removeFavorite(
    @Body() removeFavoriteDto: RemoveFavoriteDto,
    @Request() req: any,
  ) {
    const user = req.user;
    const user_id = user.user_id;
    await this.favoritesService.removeFavorite(user_id, removeFavoriteDto);
    return {
      statusCode: 200,
      message: '즐겨찾기가 제거되었습니다.',
    };
  }

  @ApiOperation({
    summary: '즐겨찾기 목록 조회',
    description: '로그인한 사용자의 즐겨찾기 목록을 조회합니다.',
  })
  @Get()
  async getFavorites(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Request() req: any,
  ) {
    const user = req.user;
    const user_id = user.user_id;
    const favorites = await this.favoritesService.getFavorites(
      user_id,
      page,
      size,
    );
    return {
      statusCode: 200,
      message: '즐겨찾기 목록을 조회했습니다.',
      data: favorites,
    };
  }

  @ApiOperation({
    summary: '특정 게시글의 찜 상태 조회',
    description: '로그인한 사용자가 특정 게시글을 찜했는지 여부를 조회합니다.',
  })
  @Get(':articleId')
  async isFavorited(
    @Param('articleId') articleId: number,
    @Request() req: any,
  ) {
    const user = req.user;
    const user_id = user.user_id;
    const isFavorited = await this.favoritesService.isFavorited(
      user_id,
      articleId,
    );
    return {
      statusCode: 200,
      message: '찜 상태를 조회했습니다.',
      data: isFavorited,
    };
  }
}
