// chat.module.ts

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ChatRoom } from './entities/chatRoom.entity';
import { Apply } from 'src/res/apply/entities/apply.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/res/user/user.module';
import { ChatController } from './chat.controller';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, ChatRoom, Apply, User]),
    AuthModule,
    UserModule, // UserService를 사용하기 위해 임포트
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
