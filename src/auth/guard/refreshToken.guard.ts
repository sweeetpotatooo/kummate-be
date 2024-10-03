//src/auth/guard/refreshToken.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('refresh_token') {}
