import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class PatchMyInfoForm {
  @IsOptional()
  @IsString()
  gender?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsInt()
  @IsOptional()
  student_id?: number;

  @IsString()
  @IsOptional()
  department?: string;

  @IsBoolean()
  @IsNotEmpty()
  isSmoke: boolean;

  @IsString()
  @IsOptional()
  mbti?: string;

  @IsString()
  @IsOptional()
  ageGroup?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  dorm?: string;

  @IsString()
  @IsOptional()
  activityTime?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  favoriteTag?: string[];

  @IsString()
  @IsOptional()
  myText?: string;

  @IsString()
  @IsOptional()
  profileImage?: string; // 유효성 검사 추가

  static toDto(form: PatchMyInfoForm): PatchMyInfoRequestDto {
    const dto = new PatchMyInfoRequestDto();
    dto.gender = form.gender;
    dto.age = form.age;
    dto.isSmoke = form.isSmoke;
    dto.activityTime = form.activityTime;
    dto.region = form.region;
    dto.mbti = form.mbti;
    dto.tags = form.favoriteTag || [];
    dto.dorm = form.dorm;
    dto.detail = form.myText;
    dto.ageGroup = form.ageGroup;
    dto.profileImage = form.profileImage; // 추가
    dto.student_id = form.student_id;
    dto.department = form.department;
    return dto;
  }
}

export class PatchMyInfoRequestDto {
  @IsString()
  @IsOptional()
  gender?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsInt()
  @IsOptional()
  student_id?: number;

  @IsString()
  @IsOptional()
  department?: string;

  @IsBoolean()
  @IsOptional()
  isSmoke?: boolean;

  @IsString()
  @IsOptional()
  activityTime?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  dorm?: string;

  @IsString()
  @IsOptional()
  mbti?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  detail?: string;

  @IsString()
  @IsOptional()
  profileImage?: string; // 유효성 검사 추가

  @IsString()
  ageGroup: string;
}
