export class ApiResponse<T> {
  // 생성자: 응답 코드, 데이터, 메시지를 받는 구조
  constructor(
    public readonly code: ResponseCode, // 응답 코드 (성공, 생성, 오류 등)
    public readonly data?: T, // 제네릭 데이터, 응답에 포함될 실제 데이터
    public readonly message?: string, // 응답 메시지 (성공 또는 오류 메시지)
  ) {}

  // 성공 응답 생성 메서드
  // 데이터와 메시지를 받아 성공 응답을 생성
  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse(ResponseCode.RESPONSE_SUCCESS, data, message);
  }

  // 생성된 응답 생성 메서드
  // 데이터와 메시지를 받아 생성된 응답을 생성
  static created<T>(data?: T, message: string = 'Created'): ApiResponse<T> {
    return new ApiResponse(ResponseCode.RESPONSE_CREATED, data, message);
  }

  // 오류 응답 생성 메서드
  // 오류 메시지와 데이터를 받아 오류 응답을 생성
  static error<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse(ResponseCode.RESPONSE_ERROR, data, message);
  }

  // 응답을 JSON 형태로 변환하는 메서드
  toJson() {
    return {
      code: this.code, // 응답 코드
      data: this.data, // 응답 데이터
      message: this.message, // 응답 메시지
    };
  }
}

export enum ResponseCode {
  RESPONSE_SUCCESS = 'RESPONSE_SUCCESS', // 성공 코드
  RESPONSE_CREATED = 'RESPONSE_CREATED', // 생성된 리소스 코드
  RESPONSE_ERROR = 'RESPONSE_ERROR', // 오류 코드
}
