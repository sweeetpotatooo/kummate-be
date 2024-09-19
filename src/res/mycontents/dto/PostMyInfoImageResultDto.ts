// src/dto/post-my-info-image-result.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class PostMyInfoImageResultDto {
  @IsString()
  @IsNotEmpty()
  image: string;

  constructor(image: string) {
    this.image = image;
  }
}
