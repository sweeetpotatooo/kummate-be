// src/dto/patch-my-nickname-request.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class PatchMyNicknameRequestDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  constructor(nickname: string) {
    this.nickname = nickname;
  }
}
