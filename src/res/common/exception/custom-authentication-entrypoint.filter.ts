// src/filters/custom-authentication-entrypoint.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class CustomAuthenticationEntryPoint implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 인증 예외가 발생했을 때 "/api/exception"으로 리다이렉트
    response.redirect('/api/exception');
  }
}
