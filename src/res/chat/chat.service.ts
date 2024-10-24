// chat.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  // 메시지 저장
  async saveMessage(data: {
    roomId: string;
    userEmail: string;
    message: string;
  }): Promise<Message> {
    const newMessage = this.messageRepository.create(data);
    return await this.messageRepository.save(newMessage);
  }

  // 채팅 내역 불러오기
  async getChatHistory(roomId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { roomId },
      order: { createDate: 'ASC' },
    });
  }
}
