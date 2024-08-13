import { IsString, IsOptional } from 'class-validator';

export class UpdateLoginDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
