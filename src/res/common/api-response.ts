// src/common/api-response.ts

import { ResponseCode } from './response-code'; // ResponseCode 임포트

export class ApiResponse<T> {
  constructor(
    public readonly code: (typeof ResponseCode)[keyof typeof ResponseCode], // 응답 코드 타입
    public readonly data?: T, // 제네릭 데이터, 응답에 포함될 실제 데이터
    public readonly message?: string, // 응답 메시지 (성공 또는 오류 메시지)
  ) {}

  // 성공 응답 생성 메서드
  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse(ResponseCode.RESPONSE_SUCCESS, data, message);
  }

  // 생성된 응답 생성 메서드
  static created<T>(data?: T, message: string = 'Created'): ApiResponse<T> {
    return new ApiResponse(ResponseCode.RESPONSE_CREATED, data, message);
  }

  // 오류 응답 생성 메서드
  static error<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse(ResponseCode.RESPONSE_FAIL, data, message);
  }

  // 응답을 JSON 형태로 변환하는 메서드
  toJson() {
    return {
      code: this.code.status, // 상태 코드
      message: this.message ?? this.code.msg, // 응답 메시지, 기본값은 코드의 메시지
      data: this.data, // 응답 데이터
    };
  }

  // Entity 형식으로 변환하는 메서드
  toEntity() {
    return this.toJson();
  }
}
