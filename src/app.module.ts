// src/app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './res/user/user.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './config/typeorm.config';
import { MycontentsModule } from './res/mycontents/mycontents.module';
import { AwsModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // .env 파일에서 환경 변수 로드
    }),
    UserModule,
    AuthModule,
    MycontentsModule,
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    AwsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
