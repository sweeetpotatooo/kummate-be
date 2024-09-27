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
} from '@nestjs/common';
import { ApiTags, ApiOperation,ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MyContentService } from './mycontents.service';
import { MyInfoDto } from './dto/MyInfoDto';
import { PatchMyInfoForm } from './dto/PatchMyInfoForm';
import { PatchMyNicknameForm } from './dto/PatchMyNicknameForm';
import { JwtAccessTokenGuard } from '../../auth/guard/accessToken.guard'; // JWT 인증 Guard
import { PatchMyNicknameResult } from './dto/PatchMyNicknameResult';
import { PatchMyInfoResultDto } from './dto/PatchMyInfoResultDto';
import { Express } from 'express'; // Express 모듈 임포트
import { ImageUploadDto } from '../../upload/dto/image-upload.dto'; // 파일 업로드 DTO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer'; // Multer의 타입을 명시적으로 불러옵니다.
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('My Controller 내정보 API')
@Controller('api/my')
export class MyContentController {
  constructor(private readonly myContentService: MyContentService) {}

  @UseGuards(JwtAccessTokenGuard) // JWT 인증 적용
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
  patchMyNickName(
    @Request() req,
    @Body() form: PatchMyNicknameForm,
  ): Promise<PatchMyNicknameResult> {
    const user = req.user;
    return this.myContentService.patchNickname(user, form);
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
}
