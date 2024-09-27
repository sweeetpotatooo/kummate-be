import { Injectable } from '@nestjs/common';
import { AwsService } from '../../upload/upload.service'; // AWS 서비스 import
import { UUIDService } from '../uuid/uuid.service'; // UUID 생성 등을 위한 유틸 서비스 import
import { Express } from 'express'; // Express 모듈 import

@Injectable()
export class BoardService {
  constructor(
    private readonly awsService: AwsService,
    private readonly utilsService: UUIDService,
  ) {}

  // 이미지 파일을 저장하는 메서드
  async saveImage(file: Express.Multer.File) {
    return await this.imageUpload(file);
  }

  // AWS S3에 이미지를 업로드하는 메서드
  async imageUpload(file: Express.Multer.File) {
    // 파일 이름 생성 (UUID를 기반으로)
    const imageName = this.utilsService.getUUID();
    // 파일 확장자 추출
    const ext = file.originalname.split('.').pop();

    // AWS S3에 이미지 업로드 수행
    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`, // 생성된 이미지 이름과 확장자를 결합
      file, // 업로드할 파일
      ext, // 파일 확장자
    );

    // 업로드된 이미지 URL 반환
    return { imageUrl };
  }
}
