// src/dto/patch-my-nickname-result.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class PatchMyNicknameResult {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  constructor(nickname: string) {
    this.nickname = nickname;
  }
}
