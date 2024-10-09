// src/favorites/dto/remove-favorite.dto.ts

import { IsInt, IsNotEmpty } from 'class-validator';

export class RemoveFavoriteDto {
  @IsInt()
  @IsNotEmpty()
  article_id: number;
}
