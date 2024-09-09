// src/types/custom-request.interface.ts
import { Request } from 'express';

// JWT 토큰에서 가져온 페이로드 타입 정의
export interface JwtPayload {
  id: number;
  username: string;
  token: string;
  // 필요한 다른 필드도 여기에 추가 가능
}

// Request 객체 확장 (req.user에 JwtPayload가 포함되도록)
export interface CustomRequest extends Request {
  user: JwtPayload;
}
