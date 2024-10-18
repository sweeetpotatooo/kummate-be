import { Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoriteArticleDto } from './dto/favorite-article.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';

@Controller('api/articles')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // 즐겨찾기 추가/삭제 엔드포인트
  @UseGuards(JwtAccessTokenGuard)
  @Post('favorites/:id')
  async toggleFavorite(
    @Req() req,
    @Param('id') id: number,
  ): Promise<{ message: string }> {
    const user = req.user;
    const message = await this.favoritesService.toggleFavorite(user, id);
    return { message };
  }
}

@Controller('api/my')
export class MyFavoriteController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // 즐겨찾기한 게시글 목록 조회 엔드포인트
  @UseGuards(JwtAccessTokenGuard)
  @Get('favorites')
  async getFavoriteArticles(@Req() req): Promise<FavoriteArticleDto[]> {
    const user = req.user;
    return await this.favoritesService.getFavoriteArticles(user);
  }
}
