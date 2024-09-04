// src/types/auth.type.ts

export interface AccessTokenPayload {
  sub: number; // 사용자 ID (subject)
  username: string; // 사용자 이메일 또는 사용자명
  iat?: number; // 토큰 발급 시간 (issued at)
  exp?: number; // 토큰 만료 시간 (expiration)
}

export interface RefreshTokenPayload {
  sub: number; // 사용자 ID (subject)
  username: string; // 사용자 이메일 또는 사용자명
  iat?: number; // 토큰 발급 시간 (issued at)
  exp?: number; // 토큰 만료 시간 (expiration)
  jti: string; // JWT ID, 토큰의 고유 식별자
}

export interface TokenData {
  accessToken: string; // 액세스 토큰
  refreshToken: string; // 리프레시 토큰
  expiresIn: number; // 액세스 토큰의 만료 시간 (초 단위)
}
