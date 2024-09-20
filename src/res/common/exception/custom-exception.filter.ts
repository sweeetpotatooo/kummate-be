// src/filters/custom-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomException } from '../exception/custom.exception'; // 사용자 정의 예외
import { ApiResponse } from '../api-response'; // API 응답 포맷을 정의한 클래스
import { ERROR_CODES } from '../exception/error-codes'; // ErrorCode 정의한 파일

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // CustomException 처리
    if (exception instanceof CustomException) {
      const errorCode = exception.getErrorCode();
      response
        .status(400) // HTTP 상태 코드
        .json(ApiResponse.error(errorCode.msg).toEntity()); // 수정된 부분: builder 대신 error 사용
      return;
    }

    // 요청 파라미터가 누락된 경우 처리 (MissingServletRequestParameterException 대응)
    if (
      exception instanceof BadRequestException &&
      exception.message.includes('Missing required parameter')
    ) {
      response
        .status(400)
        .json(ApiResponse.error(ERROR_CODES.INVALID_ARTICLE.msg).toEntity()); // 수정된 부분
      return;
    }

    // 파라미터 타입 불일치 예외 처리 (MethodArgumentTypeMismatchException 대응)
    if (
      exception instanceof BadRequestException &&
      exception.message.includes('invalid type')
    ) {
      response
        .status(400)
        .json(ApiResponse.error(ERROR_CODES.INVALID_ARTICLE.msg).toEntity()); // 수정된 부분
      return;
    }

    // 그 외의 HttpException 처리
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      response.status(status).json({
        statusCode: status,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    } else {
      // 기타 예외 처리
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
