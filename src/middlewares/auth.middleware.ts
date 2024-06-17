import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 인증 로직 추가
    if (!req.headers.authorization) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }
}
