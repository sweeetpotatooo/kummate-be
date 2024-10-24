// chat.module.ts

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/res/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    AuthModule,
    UserModule, // UserService를 사용하기 위해 임포트
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
