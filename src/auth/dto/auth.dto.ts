// src/dto/auth.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

export class SignUpRequestDto {
  email: string;
  password: string;
  nickname: string;
}

export class SignInRequestDto {
  email: string;
  password: string;
}

export class TokenDto {
  atk: string;
  rtk: string;

  constructor(atk: string, rtk: string) {
    this.atk = atk;
    this.rtk = rtk;
  }
}

export class SignInResultDto {
  token: TokenDto;
}

export class OAuth2SignInRequestDto {
  code: string;
  registrationId: string;
}

export class OAuth2ProfileDto {
  email: string;
  nickName: string;
  imageUrl: string;

  static fromKakao(data: any): OAuth2ProfileDto {
    return {
      email: data.kakao_account.email,
      nickName: data.properties.nickname,
      imageUrl: data.properties.profile_image,
    };
  }

  static fromGoogle(data: any): OAuth2ProfileDto {
    return {
      email: data.email,
      nickName: data.name,
      imageUrl: data.picture,
    };
  }
}
export class LogOutResultDto {
  expiredToken: TokenDto;

  constructor(expiredToken: TokenDto) {
    this.expiredToken = expiredToken;
  }
}
