// src/favorites/dto/create-favorite.dto.ts

import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @IsInt()
  @IsNotEmpty()
  article_id: number;
}
