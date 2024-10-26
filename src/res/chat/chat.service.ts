// chat.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Apply } from '../apply/entities/apply.entity';
import { ChatRoom } from './entities/chatRoom.entity';
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Apply)
    private readonly applyRepository: Repository<Apply>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
  ) {}
  // 메시지 저장
  async saveMessage(data: {
    roomId: string;
    userId: number;
    message: string;
  }): Promise<Message> {
    console.log('Saving message to database:', data);
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

  async createChatRoom(userId: number, applyId: number): Promise<string> {
    // applyId를 이용하여 신청 정보를 가져오고, 상대방 유저 ID를 가져옵니다.
    const apply = await this.applyRepository.findOne({
      where: { apply_id: applyId },
      relations: ['applicantUser'], // 관계 추가
    });
    if (!apply) {
      throw new NotFoundException('신청 정보를 찾을 수 없습니다.');
    }

    const otherUserId = apply.applicantUser.user_id;

    // 이미 존재하는 채팅방인지 확인
    const existingRoom = await this.chatRoomRepository.findOne({
      where: [
        { user1Id: userId, user2Id: otherUserId },
        { user1Id: otherUserId, user2Id: userId },
      ],
    });

    if (existingRoom) {
      return existingRoom.roomId;
    }

    // 새로운 채팅방 생성
    const roomId = `room_${applyId}_${userId}`;
    const newChatRoom = this.chatRoomRepository.create({
      roomId,
      user1Id: userId,
      user2Id: otherUserId,
    });
    await this.chatRoomRepository.save(newChatRoom);

    return roomId;
  }

  async getUserChatRooms(userId: number): Promise<ChatRoom[]> {
    return await this.chatRoomRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      relations: ['user1', 'user2'], // 사용자 관계 추가
    });
  }
}
