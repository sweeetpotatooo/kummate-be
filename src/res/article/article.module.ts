import { Module } from '@nestjs/common';
import { ArticlesService } from './article.service';
import { ArticlesController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { JwtAccessTokenGuard } from '../../auth/guard/accessToken.guard'; // 인증 모듈 경로 수정 필요

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticlesService, JwtAccessTokenGuard],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
