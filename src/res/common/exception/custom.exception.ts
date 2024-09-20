// src/exceptions/custom.exception.ts

import { HttpException, HttpStatus } from '@nestjs/common';

// ErrorCode 인터페이스 정의 (Java의 ErrorCode를 TypeScript로 정의)
interface ErrorCode {
  msg: string;
  code: number;
}

export class CustomException extends HttpException {
  private readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode) {
    // 부모 클래스인 HttpException에 메시지와 상태 코드 전달
    super(errorCode.msg, HttpStatus.BAD_REQUEST); // 상태 코드는 필요에 따라 변경 가능
    this.errorCode = errorCode;
  }

  // ErrorCode 객체 반환
  getErrorCode(): ErrorCode {
    return this.errorCode;
  }
}
