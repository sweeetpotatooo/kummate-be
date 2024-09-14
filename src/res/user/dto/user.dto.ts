import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { User } from '../entities/user.entity';
import { Gender } from '../../types/gender.enum';
import { MatchStatus } from '../../types/MatchStatus.enum';
import { Mbti } from '../../types/mbti.enum';
import { Dorm } from '../../types/dorm.enum';
import { UserType } from '../../types/usertype.enum';
import { Department } from 'src/res/types/department.enum';
import { ActivityTime } from 'src/res/types/activitytime.enum';
export class UserDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  nickname: string;

  @IsEnum(UserType)
  userType: UserType;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(MatchStatus)
  matchStatus: MatchStatus;

  @IsBoolean()
  isSmoker: boolean;

  @IsEnum(ActivityTime)
  activityTime: ActivityTime;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(Dorm)
  region: Dorm;

  @IsEnum(Department)
  department: Department;

  @IsEnum(Mbti)
  mbti: Mbti;

  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @IsString({ each: true })
  tag: Set<string>;

  @IsString()
  @IsOptional()
  detail?: string;

  @IsString({ each: true })
  roles: string[];

  static toDto(user: User): UserDto {
    const dto = new UserDto();
    dto.id = user.user_id;
    dto.email = user.email;
    dto.password = user.password;
    dto.nickname = user.nickname;
    dto.userType = user.userType;
    dto.image = user.image;
    dto.matchStatus = user.matchStatus;
    dto.isSmoker = user.isSmoker;
    dto.activityTime = user.activityTime;
    dto.gender = user.gender;
    dto.region = user.region;
    dto.mbti = user.mbti;
    dto.age = user.age;
    dto.tag = new Set(user.tags);
    dto.detail = user.detail;
    return dto;
  }
}
