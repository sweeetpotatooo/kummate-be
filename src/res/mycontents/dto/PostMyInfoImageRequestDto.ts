// src/dto/post-my-info-image-request.dto.ts

import { IsNotEmpty } from 'class-validator';
import { File } from 'multer'; // multer에서 직접 가져옵니다.

export class PostMyInfoImageRequestDto {
  @IsNotEmpty()
  image: File; // Express.Multer.File 대신 multer의 File 타입을 사용합니다.

  constructor(image: File) {
    this.image = image;
  }
}
