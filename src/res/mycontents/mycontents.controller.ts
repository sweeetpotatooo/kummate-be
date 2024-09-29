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
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MyContentService } from './mycontents.service';
import { MyInfoDto } from './dto/MyInfoDto';
import { PatchMyInfoForm } from './dto/PatchMyInfoForm';
import { PatchMyNicknameForm } from './dto/PatchMyNicknameForm';
import { JwtAccessTokenGuard } from '../../auth/guard/accessToken.guard'; // JWT 인증 Guard
import { PatchMyNicknameResult } from './dto/PatchMyNicknameResult';
import { PatchMyInfoResultDto } from './dto/PatchMyInfoResultDto';
import { Express } from 'express'; // Express 모듈 임포트
import { ImageUploadDto } from '../../upload/dto/image-upload.dto'; // 파일 업로드 DTO
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
    type: ImageUploadDto, // DTO를 사용하여 Swagger에서 파일 업로드 설명
  })
  @UseInterceptors(FileInterceptor('file')) // Multer를 사용하여 파일 업로드 처리
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
}
