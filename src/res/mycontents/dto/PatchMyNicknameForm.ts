// src/dto/patch-my-nickname-form.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';
import { PatchMyNicknameRequestDto } from './PatchMyNicknameRequestDto';

export class PatchMyNicknameForm {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  static toDto(form: PatchMyNicknameForm): PatchMyNicknameRequestDto {
    return new PatchMyNicknameRequestDto(form.nickname);
  }
}
