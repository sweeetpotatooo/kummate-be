import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UserModule } from './res/user/user.module';
import { PostModule } from './res/post/post.module';
import { LoggerMiddleware } from './middlewares/logger.Middleware';
import { AuthModule } from './auth/auth.module';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [UserModule, PostModule, AuthModule, RegisterModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
