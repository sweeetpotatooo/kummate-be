import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: 'http://34.64.166.73', // 리액트 애플리케이션이 동작하는 주소
    credentials: true,
  });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Global Validation Pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // 서버 실행
  await app.listen(3001);

  // Hot Reload 설정 (개발 환경에서만)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
