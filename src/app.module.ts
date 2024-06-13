import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UserModule } from './res/user/user.module';
import { PostModule } from './res/post/post.module';
import { LoggerMiddleware } from './middlewares/logger.Middleware';
@Module({
  imports: [UserModule, PostModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
