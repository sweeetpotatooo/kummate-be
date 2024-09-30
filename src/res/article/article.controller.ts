import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './article.service';
import { ArticleRegisterForm } from './dto/ArticleRegisterForm';
import { ArticleEditForm } from './dto/ArticleEditForm.Dto';
import { JwtAccessTokenGuard } from '../../auth/guard/accessToken.guard';

import { User } from '../../auth/user.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Article Controller 게시물 API')
@Controller('api/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: '게시물 작성', description: '게시물을 작성합니다.' })
  @UseGuards(JwtAccessTokenGuard)
  @Post()
  async postArticle(@User() user, @Body() form: ArticleRegisterForm) {
    await this.articlesService.postArticle(
      user,
      ArticleRegisterForm.toDto(form),
    );
    return { code: 201, message: '게시글이 생성되었습니다.' };
  }

  @ApiOperation({
    summary: '게시물 가져오기',
    description: 'id에 해당하는 게시물을 가져옵니다.',
  })
  @Get(':id')
  async getArticle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.articlesService.getArticle(id);
    return { code: 200, data: result };
  }

  @ApiOperation({
    summary: '작성자 작성글 보기',
    description: 'id에 해당하는 유저의 작성글을 불러옵니다.',
  })
  @Get('users/:userId')
  async getUserArticles(@Param('userId', ParseIntPipe) userId: number) {
    const result = await this.articlesService.getUserArticles(userId);
    return { code: 200, data: result };
  }

  @ApiOperation({
    summary: '게시물 수정',
    description: 'id에 해당하는 게시물의 내용을 수정합니다.',
  })
  @UseGuards(JwtAccessTokenGuard)
  @Put(':id')
  async putArticle(
    @User() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() form: ArticleEditForm,
  ) {
    await this.articlesService.putArticle(
      user,
      id,
      ArticleEditForm.toDto(form),
    );
    return { code: 200, message: '게시글이 수정되었습니다.' };
  }

  @ApiOperation({
    summary: '게시물 삭제',
    description: 'id에 해당하는 게시물을 삭제합니다.',
  })
  @UseGuards(JwtAccessTokenGuard)
  @Delete(':id')
  async deleteArticle(@User() user, @Param('id', ParseIntPipe) id: number) {
    await this.articlesService.deleteArticle(user, id);
    return { code: 200, message: '게시글이 삭제되었습니다.' };
  }
}
