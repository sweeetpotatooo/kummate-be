import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Gender } from 'src/res/types/gender.enum';
import { ActivityTime } from 'src/res/types/activitytime.enum';
import { ageGroup } from 'src/res/types/ageGroup.enum';
import { Dorm } from 'src/res/types/dorm.enum';

export class PatchMyInfoRequestDto {
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsBoolean()
  @IsOptional()
  isSmoke?: boolean;

  @IsEnum(Dorm)
  @IsOptional()
  dorm?: Dorm;

  @IsEnum(ActivityTime)
  @IsOptional()
  activityTime?: ActivityTime;

  @IsEnum(ageGroup)
  @IsOptional()
  ageGroup?: ageGroup;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  detail?: string;

  @IsString()
  @IsOptional()
  region?: string;
}
