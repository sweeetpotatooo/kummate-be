// src/res/user/dto/update-user.dto.ts
import { IsEmail, IsOptional, IsString, Length, IsDate } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(6, 20)
  password?: string;

  @IsOptional()
  @IsString()
  currentRefreshToken?: string; // 리프레시 토큰

  @IsOptional()
  @IsDate()
  currentRefreshTokenExp?: Date; // 리프레시 토큰 만료 시간
}
