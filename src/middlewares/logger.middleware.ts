import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 요청의 시작 부분에서 메소드, URL, IP 등의 정보를 출력
    console.log(`${req.method} ${req.originalUrl} - ${req.ip}`);

    // 응답이 끝난 후 상태 코드와 콘텐츠 길이 등을 로깅
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      console.log(
        `Response: Status: ${statusCode}, Content-Length: ${contentLength}`,
      );
    });

    // 다음 미들웨어 또는 컨트롤러로 넘어감
    next();
  }
}
