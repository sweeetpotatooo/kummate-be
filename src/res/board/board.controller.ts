import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BoardService } from './board.service';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Express } from 'express'; // Express 모듈 임포트
import { ImageUploadDto } from '../../upload/dto/image-upload.dto'; // 파일 업로드 DTO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer'; // Multer의 타입을 명시적으로 불러옵니다.

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 게시글 작성, 수정 시 이미지 업로드 처리
  @ApiOperation({ summary: '게시글 작성, 수정 시 이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 파일',
    type: ImageUploadDto, // DTO를 사용하여 Swagger에서 파일 업로드를 설명
  })
  @UseInterceptors(FileInterceptor('file')) // Multer를 사용하여 파일 업로드 처리
  @HttpCode(200)
  @Post('image')
  async saveImage(@UploadedFile() file: Express.Multer.File) {
    // BoardService의 imageUpload 메서드를 호출하여 파일 업로드를 처리하고 결과 반환
    return await this.boardService.imageUpload(file);
  }
}
