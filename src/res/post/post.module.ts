import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity'; // Post 엔티티를 임포트

@Module({
  imports: [TypeOrmModule.forFeature([Post])], // PostRepository 대신 Post 엔티티를 사용
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
