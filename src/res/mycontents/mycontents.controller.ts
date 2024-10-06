// src/res/mycontents/mycontents.controller.ts
import {
  Controller,
  Get,
  Patch,
  Body,
  Request,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  Query,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MyContentService } from './mycontents.service';
import { MyInfoDto } from './dto/MyInfoDto';
import { PatchMyInfoForm } from './dto/PatchMyInfoForm';
import { PatchMyNicknameForm } from './dto/PatchMyNicknameForm';
import { JwtAccessTokenGuard } from '../../auth/guard/accessToken.guard';
import { PatchMyNicknameResult } from './dto/PatchMyNicknameResult';
import { PatchMyInfoResultDto } from './dto/PatchMyInfoResultDto';
import { Express } from 'express';
import { ImageUploadDto } from '../../upload/dto/image-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticlesService } from '../article/article.service';
import { ArticlePageDto } from '../article/dto/ArticlePageDto';
import { QueryFailedError } from 'typeorm';

@ApiTags('My Controller 내정보 API')
@Controller('api/my')
export class MyContentController {
  constructor(
    private readonly myContentService: MyContentService,
    private readonly articlesService: ArticlesService, // ArticlesService 주입
  ) {}

  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({
    summary: '내정보 불러오기',
    description: '로그인 정보(토큰)를 바탕으로 자신의 정보를 가져옵니다.',
  })
  @Get()
  getMyInfo(@Request() req): Promise<MyInfoDto> {
    const user = req.user; // 인증된 사용자 정보
    return this.myContentService.getMyInfo(user);
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({
    summary: '닉네임 변경',
    description: '로그인 정보(토큰)를 이용해 닉네임을 변경합니다.',
  })
  @Patch('nickname')
  async patchMyNickName(
    @Request() req,
    @Body() form: PatchMyNicknameForm,
  ): Promise<PatchMyNicknameResult> {
    const userPayload = req.user;
    return this.myContentService.patchNickname(userPayload, form);
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({
    summary: '내 게시글 불러오기',
    description: '로그인 정보(토큰)를 바탕으로 자신의 게시글을 가져옵니다.',
  })
  @Get('articles')
  async getMyArticles(
    @Request() req,
    @Query('page') page: string,
    @Query('size') size: string,
  ): Promise<{ articles: ArticlePageDto[]; totalCnt: number }> {
    const user = req.user;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(size, 10) || 10;

    const result = await this.articlesService.getUserArticles(
      user.id, // 수정된 부분
      pageNumber,
      pageSize,
    );

    return {
      articles: result.articles,
      totalCnt: result.totalCnt,
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({
    summary: '사용자 정보 변경',
    description: '로그인 정보(토큰)를 통해 내 정보를 변경합니다.',
  })
  @Patch()
  patchMyInfo(
    @Request() req,
    @Body() form: PatchMyInfoForm,
  ): Promise<PatchMyInfoResultDto> {
    const user = req.user;
    return this.myContentService.patchMyInfo(user, form);
  }

  // 이미지 업로드를 통한 내정보 수정
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({
    summary: '내 정보 수정 시 이미지 업로드',
    description:
      '로그인 정보(토큰)를 통해 이미지를 업로드하고 내 정보를 수정합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 파일',
    type: ImageUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @Patch('image')
  async patchMyInfoWithImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() form: PatchMyInfoForm,
  ): Promise<PatchMyInfoResultDto> {
    const user = req.user;

    // 이미지 파일을 업로드하고, 반환된 이미지 URL을 사용하여 사용자 정보를 업데이트
    const uploadResult = await this.myContentService.saveImage(file);

    // 이미지 URL을 `form`에 포함시켜 사용자 정보 수정
    form.profileImage = uploadResult.imageUrl;

    return this.myContentService.patchMyInfo(user, form);
  }
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({
    summary: '프로필 이미지 업로드',
    description: '로그인 정보(토큰)를 통해 프로필 이미지를 업로드합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 파일',
    type: ImageUploadDto,
  })
  @UseInterceptors(FileInterceptor('file')) // 'file' 필드로 파일 받기
  @HttpCode(200)
  @Post('image/upload')
  async uploadProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    try {
      console.log('Received file:', file); // 파일 정보 로그 추가
      const userPayload = req.user;

      const uploadResult = await this.myContentService.saveImage(file);

      // 사용자 프로필 이미지 업데이트
      await this.myContentService.updateProfileImage(
        userPayload.id,
        uploadResult.imageUrl,
      );

      return { imageUrl: uploadResult.imageUrl };
    } catch (error) {
      console.error('Error in uploadProfileImage:', error);
      if (
        error instanceof QueryFailedError &&
        error.message.includes('ER_DATA_TOO_LONG')
      ) {
        throw new HttpException(
          '프로필 이미지 URL이 너무 깁니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        '프로필 이미지 업로드 실패',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
