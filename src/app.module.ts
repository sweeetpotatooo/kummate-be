// src/app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './res/user/user.module';
import { PostModule } from './res/post/post.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './config/typeorm.config';
import { LoginModule } from './res/login/login.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // .env 파일에서 환경 변수 로드
    }),
    UserModule,
    PostModule,
    AuthModule,
    LoginModule,
    TypeOrmModule.forRoot(typeOrmModuleOptions), // 직접 하드코딩한 설정을 사용
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
