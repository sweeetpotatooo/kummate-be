// chat.controller.ts

import {
  Controller,
  Post,
  Param,
  UseGuards,
  Req,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Post(':applyId')
  async createChatRoom(@Param('applyId') applyId: number, @Req() req) {
    const userId = req.user.user_id;
    const roomId = await this.chatService.createChatRoom(userId, applyId);
    if (!roomId) {
      throw new NotFoundException('채팅방을 생성할 수 없습니다.');
    }
    return { roomId };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('rooms')
  async getChatRooms(@Req() req) {
    const userId = req.user.user_id; // 동일하게 수정
    const rooms = await this.chatService.getUserChatRooms(userId);
    return rooms;
  }
}
