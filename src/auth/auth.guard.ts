// src/auth/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest(request: any): boolean {
    // 여기에서 인증 로직을 구현합니다.
    // 예를 들어, JWT 토큰을 검증하는 코드가 들어갈 수 있습니다.
    const token = request.headers.authorization;
    if (token && this.verifyToken(token)) {
      return true;
    }
    return false;
  }

  verifyToken(token: string): boolean {
    // JWT 토큰 검증 로직을 작성합니다.
    // 예시: 단순히 토큰이 'valid-token'인지 확인하는 로직
    return token === 'valid-token';
  }
}
