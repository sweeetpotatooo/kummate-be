// src/constants/response-code.ts

import { HttpStatus } from '@nestjs/common';
import { Code } from './code.interface'; // Code 인터페이스를 임포트

// ResponseCode 클래스 구현
export class ResponseCode implements Code {
  code: string;
  status: HttpStatus;
  msg: string;

  constructor(code: string, status: HttpStatus, msg: string) {
    this.code = code;
    this.status = status;
    this.msg = msg;
  }

  getCode(): string {
    return this.code;
  }

  getStatus(): HttpStatus {
    return this.status;
  }

  getMsg(): string {
    return this.msg;
  }

  // 정적 멤버로 자주 사용하는 코드들을 정의
  static RESPONSE_DELETED = new ResponseCode(
    'RESPONSE_DELETED',
    HttpStatus.NO_CONTENT,
    'DELETED',
  );
  static RESPONSE_CREATED = new ResponseCode(
    'RESPONSE_CREATED',
    HttpStatus.CREATED,
    'CREATED',
  );
  static RESPONSE_SUCCESS = new ResponseCode(
    'RESPONSE_SUCCESS',
    HttpStatus.OK,
    'SUCCESS',
  );
  static RESPONSE_FAIL = new ResponseCode(
    'RESPONSE_FAIL',
    HttpStatus.BAD_REQUEST,
    'FAIL',
  );
}
