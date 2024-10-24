// src/auth/user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from './auth.type';

export const User = createParamDecorator(
  (data: keyof AccessTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AccessTokenPayload;
    if (data) {
      return user?.[data];
    }
    return user;
  },
);
