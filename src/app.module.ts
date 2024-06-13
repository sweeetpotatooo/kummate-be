import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './res/user/user.module';
import { PostModule } from './res/post/post.module';
import { CommentModule } from './res/comment/comment.module';

@Module({
  imports: [UserModule, PostModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
