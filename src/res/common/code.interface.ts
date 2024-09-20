// src/interfaces/code.interface.ts

import { HttpStatus } from '@nestjs/common';

// Code 인터페이스 정의
export interface Code {
  code: string; // 코드
  status: HttpStatus; // HTTP 상태 코드
  msg: string; // 메시지

  getCode(): string; // 코드 반환 메서드
  getStatus(): HttpStatus; // 상태 반환 메서드
  getMsg(): string; // 메시지 반환 메서드
}
